package com.voyageai.backend.controller;

import com.voyageai.backend.dto.ItinerarioCompletoRequest;
import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.Itinerario;
import com.voyageai.backend.entity.ItinerarioActividad;
import com.voyageai.backend.service.ItinerarioService;
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
@RequestMapping("/api/itinerarios")
@CrossOrigin(origins = "*")
@Tag(name = "Itinerarios", description = "Planificación de viajes — entidad principal del negocio")
public class ItinerarioController {

    @Autowired private ItinerarioService itinerarioService;

    @GetMapping
    @Operation(summary = "Listar todos los itinerarios")
    public ResponseEntity<List<Itinerario>> getAll() {
        return ResponseEntity.ok(itinerarioService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener itinerario por ID")
    public ResponseEntity<Itinerario> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itinerarioService.findById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Listar itinerarios de un usuario")
    public ResponseEntity<List<Itinerario>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(itinerarioService.findByUsuario(usuarioId));
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar itinerarios por estado (borrador|activo|completado|cancelado)")
    public ResponseEntity<List<Itinerario>> getByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(itinerarioService.findByEstado(estado));
    }

    @GetMapping("/{id}/actividades")
    @Operation(summary = "Listar actividades de un itinerario ordenadas por día")
    public ResponseEntity<List<ItinerarioActividad>> getActividades(@PathVariable Long id) {
        return ResponseEntity.ok(itinerarioService.findActividades(id));
    }

    @PostMapping("/completo")
    @Operation(
        summary = "Registrar itinerario completo con actividades (ADMIN) — proceso @Transactional",
        description = "Crea el itinerario y todas sus actividades en una sola transacción. " +
            "Si alguna actividad falla, se hace rollback completo."
    )
    public ResponseEntity<Itinerario> registrarCompleto(
        @Valid @RequestBody ItinerarioCompletoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(itinerarioService.registrarItinerarioCompleto(request));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado de un itinerario (ADMIN)")
    public ResponseEntity<Itinerario> actualizarEstado(
        @PathVariable Long id,
        @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            itinerarioService.actualizarEstado(id, body.get("estado")));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar itinerario (ADMIN) — eliminación física")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Long id) {
        itinerarioService.eliminar(id);
        return ResponseEntity.ok(new MensajeResponse("Itinerario eliminado correctamente"));
    }
}