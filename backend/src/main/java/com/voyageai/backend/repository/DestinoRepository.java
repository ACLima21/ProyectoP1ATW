package com.voyageai.backend.repository;

import com.voyageai.backend.entity.Destino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DestinoRepository extends JpaRepository<Destino, Long> {
    List<Destino> findByNameContainingIgnoreCase(String name);
    List<Destino> findByPlace(String place);
}