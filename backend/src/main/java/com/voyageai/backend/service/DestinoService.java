package com.voyageai.backend.service;

import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.DestinoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Slf4j
@Service
public class DestinoService {

    // IDs fijos de los destinos que se muestran en el carrusel de la landing.
    // Se eligieron manualmente (no dependen de orden de tabla ni paginación).
    // Para cambiar cuáles se muestran, solo hay que editar esta lista.
    private static final List<Long> CAROUSEL_IDS = List.of(82L, 83L, 84L, 85L, 86L);

    @Autowired private DestinoRepository destinoRepository;

    public List<Destino> findAll()           { return destinoRepository.findAll(); }
    public List<Destino> findActivos()       { return destinoRepository.findByActivo(true); }
    public List<Destino> buscarPorNombre(String nombre) {
        return destinoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public Page<Destino> findAll(Pageable pageable) {
        return destinoRepository.findAll(pageable);
    }

    public Page<Destino> findActivos(Pageable pageable) {
        return destinoRepository.findByActivo(true, pageable);
    }

    public Page<Destino> buscarPorNombre(String nombre, Pageable pageable) {
        return destinoRepository.findByNombreContainingIgnoreCase(nombre, pageable);
    }

    public Destino findById(Long id) {
        return destinoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado con id: " + id));
    }

    // Destinos fijos para el carrusel de la landing (GET /api/destinos/carousel).
    // Usa findAllById, que ya viene incluido en JpaRepository — no requiere
    // ningún método nuevo en DestinoRepository.
    public List<Destino> findCarousel() {
        return destinoRepository.findAllById(CAROUSEL_IDS);
    }

    @Transactional
    public Destino crear(Destino destino) {
        log.info("🌍 Creando destino: {}", destino.getNombre());
        destino.setActivo(true);
        Destino saved = destinoRepository.save(destino);
        log.info("✅ Destino creado con ID: {}", saved.getId());
        return saved;
    }

    @Transactional
    public Destino actualizar(Long id, Destino datos) {
        log.info("✏️ Actualizando destino: {}", id);
        Destino destino = findById(id);
        destino.setNombre(datos.getNombre());
        destino.setCiudad(datos.getCiudad());
        destino.setPais(datos.getPais());
        destino.setRegion(datos.getRegion());
        destino.setContinente(datos.getContinente());
        destino.setPrecioDesde(datos.getPrecioDesde());
        destino.setDescripcion(datos.getDescripcion());
        destino.setClima(datos.getClima());
        destino.setIdiomaPrincipal(datos.getIdiomaPrincipal());
        return destinoRepository.save(destino);
    }

    @Transactional
    public void desactivar(Long id) {
        log.info("🗑️ Desactivando destino: {}", id);
        Destino destino = findById(id);
        destino.setActivo(false);
        destinoRepository.save(destino);
    }
}