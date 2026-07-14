package com.voyageai.backend.repository;
import com.voyageai.backend.entity.Itinerario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ItinerarioRepository extends JpaRepository<Itinerario, Long> {
    List<Itinerario> findByUsuarioId(Long usuarioId);
    List<Itinerario> findByDestinoId(Long destinoId);
    List<Itinerario> findByEstado(String estado);
}