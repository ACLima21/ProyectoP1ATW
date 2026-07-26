package com.voyageai.backend.repository;
import com.voyageai.backend.entity.Itinerario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ItinerarioRepository extends JpaRepository<Itinerario, Long> {
    List<Itinerario> findByUsuarioId(Long usuarioId);
    List<Itinerario> findByDestinoId(Long destinoId);
    List<Itinerario> findByEstado(String estado);
    Page<Itinerario> findByUsuarioId(Long usuarioId, Pageable pageable);
    Page<Itinerario> findByEstado(String estado, Pageable pageable);
}