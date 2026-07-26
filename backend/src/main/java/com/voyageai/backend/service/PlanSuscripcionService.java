package com.voyageai.backend.service;

import com.voyageai.backend.entity.PlanSuscripcion;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.PlanSuscripcionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Slf4j
@Service
public class PlanSuscripcionService {

    @Autowired
    private PlanSuscripcionRepository planRepository;

    public List<PlanSuscripcion> findAll() {
        return planRepository.findAll();
    }

    public Page<PlanSuscripcion> findAllPaged(Pageable pageable) {
        return planRepository.findAll(pageable);
    }

    public PlanSuscripcion findById(Long id) {
        return planRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Plan no encontrado con id: " + id));
    }

    @Transactional
    public PlanSuscripcion crear(PlanSuscripcion plan) {
        log.info("📋 Creando plan: {}", plan.getNombre());
        return planRepository.save(plan);
    }

    @Transactional
    public PlanSuscripcion actualizar(Long id, PlanSuscripcion datos) {
        log.info("✏️ Actualizando plan: {}", id);
        PlanSuscripcion plan = findById(id);
        plan.setNombre(datos.getNombre());
        plan.setPrecioMensual(datos.getPrecioMensual());
        plan.setPrecioAnual(datos.getPrecioAnual());
        plan.setDescuentoAnual(datos.getDescuentoAnual());
        plan.setDescripcion(datos.getDescripcion());
        plan.setMaxItinerarios(datos.getMaxItinerarios());
        plan.setDestacado(datos.getDestacado());
        plan.setActivo(datos.getActivo());
        return planRepository.save(plan);
    }

    @Transactional
    public void desactivar(Long id) {
        log.info("🗑️ Desactivando plan: {}", id);
        PlanSuscripcion plan = findById(id);
        plan.setActivo(false);
        planRepository.save(plan);
    }
}