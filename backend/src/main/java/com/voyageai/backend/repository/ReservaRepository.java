package com.voyageai.backend.repository;
import com.voyageai.backend.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    boolean existsByItinerarioId(Long itinerarioId);
    Optional<Reserva> findByCodigoReserva(String codigo);
    List<Reserva> findByUsuarioId(Long usuarioId);
    List<Reserva> findByEstado(String estado);
}