package com.voyageai.backend.controller;

import com.voyageai.backend.entity.Reserva;
import com.voyageai.backend.service.ReservaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@Tag(name = "Reservas", description = "Gestión de reservas de viajes")
public class ReservaController {

    @Autowired private ReservaService reservaService;

    @GetMapping
    @Operation(summary = "Listar todas las reservas")
    public ResponseEntity<List<Reserva>> getAll() {
        return ResponseEntity.ok(reservaService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener reserva por ID")
    public ResponseEntity<Reserva> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.findById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar reservas de un usuario")
    public ResponseEntity<List<Reserva>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.findByUsuario(usuarioId));
    }

    @PostMapping
    @Operation(summary = "Crear nueva reserva (ADMIN)")
    public ResponseEntity<Reserva> crear(@Valid @RequestBody Reserva reserva) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.crear(reserva));
    }

    @PatchMapping("/{id}/confirmar")
    @Operation(summary = "Confirmar una reserva (ADMIN)")
    public ResponseEntity<Reserva> confirmar(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.confirmar(id));
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una reserva (ADMIN)")
    public ResponseEntity<Reserva> cancelar(
        @PathVariable Long id,
        @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(reservaService.cancelar(id, body.get("motivo")));
    }
}