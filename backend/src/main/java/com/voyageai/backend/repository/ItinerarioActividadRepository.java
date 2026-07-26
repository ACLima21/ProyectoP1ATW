package com.voyageai.backend.repository;
import com.voyageai.backend.entity.ItinerarioActividad;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItinerarioActividadRepository extends JpaRepository<ItinerarioActividad, Long> {
    List<ItinerarioActividad> findByItinerarioIdOrderByDiaNumeroAscOrdenAsc(Long itinerarioId);
}