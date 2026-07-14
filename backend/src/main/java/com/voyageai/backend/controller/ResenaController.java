package com.voyageai.backend.controller;

import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.Resena;
import com.voyageai.backend.service.ResenaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
@Tag(name = "Reseñas", description = "Valoraciones de destinos turísticos")
public class ResenaController {

    @Autowired private ResenaService resenaService;

    @GetMapping
    @Operation(summary = "Listar todas las reseñas")
    public ResponseEntity<List<Resena>> getAll() {
        return ResponseEntity.ok(resenaService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener reseña por ID")
    public ResponseEntity<Resena> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resenaService.findById(id));
    }

    @GetMapping("/destino/{destinoId}")
    @Operation(summary = "Listar reseñas de un destino")
    public ResponseEntity<List<Resena>> getByDestino(@PathVariable Long destinoId) {
        return ResponseEntity.ok(resenaService.findByDestino(destinoId));
    }

    @GetMapping("/aprobadas")
    @Operation(summary = "Listar solo reseñas aprobadas")
    public ResponseEntity<List<Resena>> getAprobadas() {
        return ResponseEntity.ok(resenaService.findAprobadas());
    }

    @PostMapping
    @Operation(summary = "Registrar nueva reseña (ADMIN)")
    public ResponseEntity<Resena> crear(@Valid @RequestBody Resena resena) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resenaService.crear(resena));
    }

    @PatchMapping("/{id}/aprobar")
    @Operation(summary = "Aprobar una reseña (ADMIN)")
    public ResponseEntity<Resena> aprobar(@PathVariable Long id) {
        return ResponseEntity.ok(resenaService.aprobar(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar reseña (ADMIN)")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Long id) {
        resenaService.eliminar(id);
        return ResponseEntity.ok(new MensajeResponse("Reseña eliminada correctamente"));
    }
}