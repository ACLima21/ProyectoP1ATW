package com.voyageai.backend.controller;

import com.voyageai.backend.entity.Stat;
import com.voyageai.backend.service.StatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
@Tag(name = "Stats", description = "Gestión de estadísticas de la plataforma")
public class StatController {

    @Autowired
    private StatService statService;

    @GetMapping
    @Operation(summary = "Obtener todas las estadísticas")
    public ResponseEntity<List<Stat>> getAll() {
        return ResponseEntity.ok(statService.findAll());
    }

    @GetMapping("/hero")
    @Operation(summary = "Obtener estadísticas del Hero (sección principal)")
    public ResponseEntity<List<Stat>> getHeroStats() {
        return ResponseEntity.ok(statService.findHeroStats());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener estadística por ID")
    public ResponseEntity<Stat> getById(@PathVariable Long id) {
        return ResponseEntity.ok(statService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear una nueva estadística")
    public ResponseEntity<Stat> create(@Valid @RequestBody Stat stat) {
        return ResponseEntity.status(HttpStatus.CREATED).body(statService.save(stat));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una estadística")
    public ResponseEntity<Stat> update(@PathVariable Long id, @Valid @RequestBody Stat stat) {
        return ResponseEntity.ok(statService.update(id, stat));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una estadística")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        statService.delete(id);
        return ResponseEntity.noContent().build();
    }
}