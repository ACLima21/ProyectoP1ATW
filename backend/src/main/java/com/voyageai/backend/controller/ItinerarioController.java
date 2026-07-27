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
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/itinerarios")
@CrossOrigin(origins = "*")
@Tag(name = "Itinerarios", description = "Planificación de viajes — entidad principal del negocio")
public class ItinerarioController {

    @Autowired private ItinerarioService itinerarioService;

    @GetMapping
    public ResponseEntity<Page<Itinerario>> getAll(
        @PageableDefault(size = 150) Pageable pageable) {
        return ResponseEntity.ok(itinerarioService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener itinerario por ID")
    public ResponseEntity<Itinerario> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itinerarioService.findById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<Itinerario>> getByUsuario(
        @PathVariable Long usuarioId,
        @PageableDefault(size = 150) Pageable pageable) {
        return ResponseEntity.ok(
            itinerarioService.findByUsuario(usuarioId, pageable));
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
        summary = "Registrar itinerario completo con actividades — @Transactional",
        description = "Crea el itinerario y todas sus actividades en una sola transacción. " +
            "Disponible para cualquier usuario autenticado: un usuario con rol 'usuario' " +
            "solo puede crear el itinerario para SÍ MISMO (el backend ignora el usuarioId " +
            "del body y usa su propia identidad); un ADMIN puede crear a nombre de cualquier " +
            "usuario, igual que antes. Si alguna actividad falla, se hace rollback completo."
    )
    public ResponseEntity<Itinerario> registrarCompleto(
        @Valid @RequestBody ItinerarioCompletoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(itinerarioService.registrarItinerarioCompleto(request));
    }

    @PostMapping("/{id}/resumen-ia")
    @Operation(
        summary = "Generar un resumen personalizado del itinerario usando IA (Ollama, modelo local)",
        description = "Llama a un modelo de lenguaje corriendo localmente vía Ollama " +
            "(http://localhost:11434) para redactar un resumen descriptivo del viaje a " +
            "partir de sus datos reales (destino, fechas, personas, presupuesto, notas). " +
            "Solo el dueño del itinerario o un ADMIN pueden generarlo."
    )
    public ResponseEntity<Itinerario> generarResumenIa(@PathVariable Long id) {
        return ResponseEntity.ok(itinerarioService.generarResumenIa(id));
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