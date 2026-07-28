package com.voyageai.backend.service;

import com.voyageai.backend.dto.ActividadRequest;
import com.voyageai.backend.dto.ItinerarioCompletoRequest;
import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.entity.Itinerario;
import com.voyageai.backend.entity.ItinerarioActividad;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.DestinoRepository;
import com.voyageai.backend.repository.ItinerarioActividadRepository;
import com.voyageai.backend.repository.ItinerarioRepository;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class ItinerarioService {

    @Autowired private ItinerarioRepository itinerarioRepository;
    @Autowired private ItinerarioActividadRepository actividadRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private DestinoRepository destinoRepository;
    @Autowired private OllamaService ollamaService;

    public List<Itinerario> findAll()                  { return itinerarioRepository.findAll(); }
    public List<Itinerario> findByUsuario(Long uid)    { return itinerarioRepository.findByUsuarioId(uid); }
    public List<Itinerario> findByEstado(String estado){ return itinerarioRepository.findByEstado(estado); }

    public Page<Itinerario> findAll(Pageable pageable) {
        return itinerarioRepository.findAll(pageable);
    }

    public Page<Itinerario> findByUsuario(Long usuarioId, Pageable pageable) {
        return itinerarioRepository.findByUsuarioId(usuarioId, pageable);
    }

    public Itinerario findById(Long id) {
        return itinerarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Itinerario no encontrado con id: " + id));
    }

    public List<ItinerarioActividad> findActividades(Long itinerarioId) {
        findById(itinerarioId); // valida que existe
        return actividadRepository.findByItinerarioIdOrderByDiaNumeroAscOrdenAsc(itinerarioId);
    }

    /*
     * PROCESO TRANSACCIONAL PRINCIPAL
     * ─────────────────────────────────────────────────────────────────────
     * @Transactional garantiza que el itinerario y TODAS sus actividades
     * se guarden como una sola unidad atómica.
     *
     * Si el itinerario se crea pero falla al guardar una actividad,
     * PostgreSQL hace rollback automático — no queda ningún registro
     * incompleto en la base de datos.
     *
     * SEGURIDAD (IDOR):
     * Este endpoint ahora lo puede llamar cualquier usuario autenticado,
     * no solo ADMIN (ver SecurityConfig). Para evitar que un usuario cree
     * itinerarios a nombre de otra persona cambiando el "usuarioId" del
     * body, resolverUsuarioId() ignora ese valor cuando quien llama NO es
     * administrador, y lo reemplaza por el ID de quien está autenticado.
     * Los administradores conservan el comportamiento original: pueden
     * crear itinerarios para cualquier usuario (lo usa el AdminPanel).
     * ─────────────────────────────────────────────────────────────────────
     */
    @Transactional
    public Itinerario registrarItinerarioCompleto(ItinerarioCompletoRequest request) {
        Long usuarioIdFinal = resolverUsuarioId(request.getUsuarioId());

        log.info("🚀 Iniciando registro de itinerario completo para usuario: {}", usuarioIdFinal);

        // 1. Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(usuarioIdFinal)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con id: " + usuarioIdFinal));

        // 2. Validar que el destino existe y está activo
        Destino destino = destinoRepository.findById(request.getDestinoId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Destino no encontrado con id: " + request.getDestinoId()));

        if (!Boolean.TRUE.equals(destino.getActivo())) {
            throw new BusinessException("El destino no está disponible: " + destino.getNombre());
        }

        // 3. Validar fechas
        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new BusinessException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        // 4. Crear el itinerario
        Itinerario itinerario = new Itinerario();
        itinerario.setUsuario(usuario);
        itinerario.setDestino(destino);
        itinerario.setTitulo(request.getTitulo());
        itinerario.setFechaInicio(request.getFechaInicio());
        itinerario.setFechaFin(request.getFechaFin());
        itinerario.setNumPersonas(request.getNumPersonas() != null ? request.getNumPersonas() : 1);
        itinerario.setPresupuestoTotal(request.getPresupuestoTotal());
        itinerario.setMoneda(request.getMoneda() != null ? request.getMoneda() : "USD");
        itinerario.setEstado("borrador");
        itinerario.setGeneradoPorIa(request.getGeneradoPorIa() != null ? request.getGeneradoPorIa() : false);
        itinerario.setNotas(request.getNotas());

        Itinerario saved = itinerarioRepository.save(itinerario);
        log.info("📋 Itinerario creado con ID: {}", saved.getId());

        // 5. Crear las actividades vinculadas al itinerario
        if (request.getActividades() != null && !request.getActividades().isEmpty()) {
            for (ActividadRequest actReq : request.getActividades()) {
                ItinerarioActividad actividad = new ItinerarioActividad();
                actividad.setItinerario(saved);
                actividad.setDiaNumero(actReq.getDiaNumero());
                actividad.setOrden(actReq.getOrden() != null ? actReq.getOrden() : 1);
                actividad.setHoraInicio(actReq.getHoraInicio());
                actividad.setHoraFin(actReq.getHoraFin());
                actividad.setTitulo(actReq.getTitulo());
                actividad.setDescripcion(actReq.getDescripcion());
                actividad.setTipo(actReq.getTipo() != null ? actReq.getTipo() : "turismo");
                actividad.setLugar(actReq.getLugar());
                actividad.setCostoEstimado(actReq.getCostoEstimado());
                actividad.setMoneda(actReq.getMoneda() != null ? actReq.getMoneda() : "USD");
                actividadRepository.save(actividad);
            }
            log.info("✅ {} actividades registradas para el itinerario {}",
                request.getActividades().size(), saved.getId());
        }

        log.info("🎉 Itinerario completo registrado exitosamente. ID: {}", saved.getId());
        return saved;
    }

    /*
     * Genera (y guarda) el resumen descriptivo del itinerario usando el
     * modelo de IA local vía OllamaService. Se llama en un segundo paso,
     * después de crear el itinerario — así la creación no queda lenta
     * esperando al modelo, y si Ollama está caído, el itinerario ya
     * creado no se ve afectado.
     */
    @Transactional
    public Itinerario generarResumenIa(Long id) {
        Itinerario itinerario = findById(id);

        // Mismo criterio de seguridad que en registrarItinerarioCompleto:
        // un usuario normal solo puede generar el resumen de SU PROPIO
        // itinerario; un admin puede hacerlo para cualquiera.
        verificarPropietarioOAdmin(itinerario);

        String resumen = ollamaService.generarResumenItinerario(itinerario);
        itinerario.setResumenIa(resumen);
        return itinerarioRepository.save(itinerario);
    }

    // Determina a nombre de qué usuario se crea el itinerario.
    // - ADMIN: se respeta el usuarioId que venga en el request (comportamiento
    //   original, lo usa el AdminPanel para crear a nombre de cualquiera).
    // - Cualquier otro rol: se ignora el usuarioId del request y se usa el ID
    //   del usuario autenticado (sacado del JWT vía SecurityContext), para
    //   que nadie pueda crear itinerarios a nombre de otra persona.
    private Long resolverUsuarioId(Long usuarioIdDelBody) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean esAdmin = auth != null && auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (esAdmin) {
            return usuarioIdDelBody;
        }

        String correo = auth.getName();
        return usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con correo: " + correo))
            .getId();
    }

    // Verifica que quien pide generar el resumen sea el dueño del
    // itinerario o un administrador — evita que cualquier usuario
    // autenticado pueda generar (y gastar cómputo de Ollama) sobre
    // itinerarios ajenos con solo adivinar el ID.
    private void verificarPropietarioOAdmin(Itinerario itinerario) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean esAdmin = auth != null && auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (esAdmin) return;

        String correo = auth.getName();
        if (!itinerario.getUsuario().getCorreo().equals(correo)) {
            throw new BusinessException("No tienes permiso para generar el resumen de este itinerario");
        }
    }

    @Transactional
    public Itinerario actualizarEstado(Long id, String nuevoEstado) {
        log.info("🔄 Actualizando estado del itinerario {} a: {}", id, nuevoEstado);
        List<String> estadosValidos = List.of("borrador", "activo", "completado", "cancelado");
        if (!estadosValidos.contains(nuevoEstado)) {
            throw new BusinessException("Estado inválido. Valores permitidos: " + estadosValidos);
        }
        Itinerario itinerario = findById(id);
        // Solo el dueño del itinerario o un ADMIN puede cambiar el estado.
        // Mismo criterio de seguridad que generarResumenIa.
        verificarPropietarioOAdmin(itinerario);
        itinerario.setEstado(nuevoEstado);
        return itinerarioRepository.save(itinerario);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("🗑️ Eliminando itinerario: {}", id);
        Itinerario itinerario = findById(id);
        if (itinerario.getEstado().equals("completado")) {
            throw new BusinessException("No se puede eliminar un itinerario completado");
        }
        itinerarioRepository.delete(itinerario);
        log.info("✅ Itinerario eliminado: {}", id);
    }
}