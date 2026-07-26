package com.voyageai.backend.repository;
import com.voyageai.backend.entity.Destino;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DestinoRepository extends JpaRepository<Destino, Long> {
    List<Destino> findByActivo(Boolean activo);
    List<Destino> findByNombreContainingIgnoreCase(String nombre);
    List<Destino> findByContinente(String continente);
    Page<Destino> findByActivo(Boolean activo, Pageable pageable);
    Page<Destino> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}