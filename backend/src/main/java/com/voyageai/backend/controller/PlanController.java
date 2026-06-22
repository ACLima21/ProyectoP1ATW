package com.voyageai.backend.controller;

import com.voyageai.backend.entity.Plan;
import com.voyageai.backend.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/planes")
@CrossOrigin(origins = "*")
@Tag(name = "Planes", description = "Gestión de planes de suscripción")
public class PlanController {

    @Autowired
    private PlanService planService;

    @GetMapping
    @Operation(summary = "Obtener todos los planes")
    public ResponseEntity<List<Plan>> getAll() {
        return ResponseEntity.ok(planService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener plan por ID")
    public ResponseEntity<Plan> getById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo plan")
    public ResponseEntity<Plan> create(@Valid @RequestBody Plan plan) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.save(plan));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un plan")
    public ResponseEntity<Plan> update(@PathVariable Long id, @Valid @RequestBody Plan plan) {
        return ResponseEntity.ok(planService.update(id, plan));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un plan")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planService.delete(id);
        return ResponseEntity.noContent().build();
    }
}