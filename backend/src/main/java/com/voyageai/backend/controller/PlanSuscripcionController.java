package com.voyageai.backend.controller;

import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.PlanSuscripcion;
import com.voyageai.backend.service.PlanSuscripcionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/planes")
@CrossOrigin(origins = "*")
@Tag(name = "Planes", description = "Planes de suscripción de VoyageAI")
public class PlanSuscripcionController {

    @Autowired
    private PlanSuscripcionService planService;

    // Endpoint público — usado por Pricing.jsx en la landing page
    @GetMapping("/todos")
    @Operation(summary = "Obtener todos los planes como lista — público")
    public ResponseEntity<List<PlanSuscripcion>> getTodos() {
        return ResponseEntity.ok(planService.findAll());
    }

    // Endpoint paginado — para administración
    @GetMapping
    @Operation(summary = "Obtener planes paginados")
    public ResponseEntity<Page<PlanSuscripcion>> getAll(
        @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(planService.findAllPaged(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener plan por ID")
    public ResponseEntity<PlanSuscripcion> getById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear plan (ADMIN)")
    public ResponseEntity<PlanSuscripcion> crear(
        @Valid @RequestBody PlanSuscripcion plan) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(planService.crear(plan));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar plan (ADMIN)")
    public ResponseEntity<PlanSuscripcion> actualizar(
        @PathVariable Long id,
        @Valid @RequestBody PlanSuscripcion datos) {
        return ResponseEntity.ok(planService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar plan lógicamente (ADMIN)")
    public ResponseEntity<MensajeResponse> desactivar(@PathVariable Long id) {
        planService.desactivar(id);
        return ResponseEntity.ok(new MensajeResponse("Plan desactivado correctamente"));
    }
}