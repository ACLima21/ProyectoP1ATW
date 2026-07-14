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

    public List<Itinerario> findAll()                  { return itinerarioRepository.findAll(); }
    public List<Itinerario> findByUsuario(Long uid)    { return itinerarioRepository.findByUsuarioId(uid); }
    public List<Itinerario> findByEstado(String estado){ return itinerarioRepository.findByEstado(estado); }

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
     * ─────────────────────────────────────────────────────────────────────
     */
    @Transactional
    public Itinerario registrarItinerarioCompleto(ItinerarioCompletoRequest request) {
        log.info("🚀 Iniciando registro de itinerario completo para usuario: {}",
            request.getUsuarioId());

        // 1. Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con id: " + request.getUsuarioId()));

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

    @Transactional
    public Itinerario actualizarEstado(Long id, String nuevoEstado) {
        log.info("🔄 Actualizando estado del itinerario {} a: {}", id, nuevoEstado);
        List<String> estadosValidos = List.of("borrador", "activo", "completado", "cancelado");
        if (!estadosValidos.contains(nuevoEstado)) {
            throw new BusinessException("Estado inválido. Valores permitidos: " + estadosValidos);
        }
        Itinerario itinerario = findById(id);
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