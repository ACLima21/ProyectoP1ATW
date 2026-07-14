package com.voyageai.backend.service;

import com.voyageai.backend.entity.Itinerario;
import com.voyageai.backend.entity.Reserva;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.ItinerarioRepository;
import com.voyageai.backend.repository.ReservaRepository;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ReservaService {

    @Autowired private ReservaRepository reservaRepository;
    @Autowired private ItinerarioRepository itinerarioRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public List<Reserva> findAll()                   { return reservaRepository.findAll(); }
    public List<Reserva> findByUsuario(Long uid)     { return reservaRepository.findByUsuarioId(uid); }
    public List<Reserva> findByEstado(String estado) { return reservaRepository.findByEstado(estado); }

    public Reserva findById(Long id) {
        return reservaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + id));
    }

    @Transactional
    public Reserva crear(Reserva reserva) {
        log.info("📦 Creando reserva para itinerario: {}", reserva.getItinerario().getId());

        // Validar que el itinerario existe
        Itinerario itinerario = itinerarioRepository.findById(reserva.getItinerario().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Itinerario no encontrado"));

        // Validar que el itinerario no tiene ya una reserva
        if (reservaRepository.existsByItinerarioId(itinerario.getId())) {
            throw new BusinessException("Este itinerario ya tiene una reserva activa");
        }

        // Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(reserva.getUsuario().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Generar código único de reserva
        String codigo = "VYG-" + UUID.randomUUID().toString()
            .replace("-", "").substring(0, 6).toUpperCase();

        reserva.setCodigoReserva(codigo);
        reserva.setItinerario(itinerario);
        reserva.setUsuario(usuario);
        reserva.setEstado("pendiente");

        // Actualizar estado del itinerario a activo
        itinerario.setEstado("activo");
        itinerarioRepository.save(itinerario);

        Reserva saved = reservaRepository.save(reserva);
        log.info("✅ Reserva creada: {} para itinerario: {}", codigo, itinerario.getId());
        return saved;
    }

    @Transactional
    public Reserva confirmar(Long id) {
        log.info("✅ Confirmando reserva: {}", id);
        Reserva reserva = findById(id);
        if (reserva.getEstado().equals("cancelada")) {
            throw new BusinessException("No se puede confirmar una reserva cancelada");
        }
        reserva.setEstado("confirmada");
        reserva.setFechaConfirmacion(OffsetDateTime.now());
        return reservaRepository.save(reserva);
    }

    @Transactional
    public Reserva cancelar(Long id, String motivo) {
        log.info("❌ Cancelando reserva: {}", id);
        Reserva reserva = findById(id);
        if (reserva.getEstado().equals("completada")) {
            throw new BusinessException("No se puede cancelar una reserva completada");
        }
        reserva.setEstado("cancelada");
        reserva.setFechaCancelacion(OffsetDateTime.now());
        reserva.setMotivoCancelacion(motivo);
        return reservaRepository.save(reserva);
    }
}