package com.voyageai.backend.controller;

import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.service.DestinoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/destinos")
@CrossOrigin(origins = "*")
@Tag(name = "Destinos", description = "Gestión de destinos turísticos")
public class DestinoController {

    @Autowired
    private DestinoService destinoService;

    @GetMapping
    @Operation(summary = "Obtener todos los destinos")
    public ResponseEntity<List<Destino>> getAll() {
        return ResponseEntity.ok(destinoService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener destino por ID")
    public ResponseEntity<Destino> getById(@PathVariable Long id) {
        return ResponseEntity.ok(destinoService.findById(id));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar destinos por nombre")
    public ResponseEntity<List<Destino>> search(@RequestParam String nombre) {
        return ResponseEntity.ok(destinoService.searchByName(nombre));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo destino")
    public ResponseEntity<Destino> create(@Valid @RequestBody Destino destino) {
        return ResponseEntity.status(HttpStatus.CREATED).body(destinoService.save(destino));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un destino")
    public ResponseEntity<Destino> update(@PathVariable Long id, @Valid @RequestBody Destino destino) {
        return ResponseEntity.ok(destinoService.update(id, destino));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un destino")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        destinoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}