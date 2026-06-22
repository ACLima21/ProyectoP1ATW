package com.voyageai.backend.controller;

import com.voyageai.backend.entity.Feature;
import com.voyageai.backend.service.FeatureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "*")
@Tag(name = "Features", description = "Gestión de características de la plataforma")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping
    @Operation(summary = "Obtener todas las características")
    public ResponseEntity<List<Feature>> getAll() {
        return ResponseEntity.ok(featureService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener característica por ID")
    public ResponseEntity<Feature> getById(@PathVariable Long id) {
        return ResponseEntity.ok(featureService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear una nueva característica")
    public ResponseEntity<Feature> create(@Valid @RequestBody Feature feature) {
        return ResponseEntity.status(HttpStatus.CREATED).body(featureService.save(feature));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una característica")
    public ResponseEntity<Feature> update(@PathVariable Long id, @Valid @RequestBody Feature feature) {
        return ResponseEntity.ok(featureService.update(id, feature));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una característica")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        featureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}