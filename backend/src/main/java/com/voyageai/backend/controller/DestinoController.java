package com.voyageai.backend.controller;

import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.service.DestinoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinos")
@CrossOrigin(origins = "*")
@Tag(name = "Destinos", description = "Catálogo de destinos turísticos")
public class DestinoController {

    @Autowired private DestinoService destinoService;

    @GetMapping
    public ResponseEntity<Page<Destino>> getAll(
        @PageableDefault(size = 150) Pageable pageable) {
        return ResponseEntity.ok(destinoService.findAll(pageable));
    }

    @GetMapping("/activos")
    public ResponseEntity<Page<Destino>> getActivos(
        @PageableDefault(size = 150) Pageable pageable) {
        return ResponseEntity.ok(destinoService.findActivos(pageable));
    }

    // Endpoint público — devuelve siempre los mismos 5 destinos fijos
    // (definidos en DestinoService.CAROUSEL_IDS) para el carrusel de la landing.
    @GetMapping("/carousel")
    @Operation(summary = "Destinos fijos para el carrusel de la landing")
    public ResponseEntity<List<Destino>> getCarousel() {
        return ResponseEntity.ok(destinoService.findCarousel());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener destino por ID")
    public ResponseEntity<Destino> getById(@PathVariable Long id) {
        return ResponseEntity.ok(destinoService.findById(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<Destino>> buscar(
        @RequestParam String nombre,
        @PageableDefault(size = 150) Pageable pageable) {
        return ResponseEntity.ok(
            destinoService.buscarPorNombre(nombre, pageable));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo destino (ADMIN)")
    public ResponseEntity<Destino> crear(@Valid @RequestBody Destino destino) {
        return ResponseEntity.status(HttpStatus.CREATED).body(destinoService.crear(destino));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar destino (ADMIN)")
    public ResponseEntity<Destino> actualizar(@PathVariable Long id, @RequestBody Destino datos) {
        return ResponseEntity.ok(destinoService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar destino lógicamente (ADMIN)")
    public ResponseEntity<MensajeResponse> desactivar(@PathVariable Long id) {
        destinoService.desactivar(id);
        return ResponseEntity.ok(new MensajeResponse("Destino desactivado correctamente"));
    }
}