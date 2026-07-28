package com.voyageai.backend.controller;

import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.service.FavoritoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
@Tag(name = "Favoritos", description = "Gestión de destinos favoritos del usuario autenticado")
public class FavoritoController {

    @Autowired private FavoritoService favoritoService;

    @GetMapping
    @Operation(summary = "Obtener destinos favoritos del usuario autenticado (paginado)")
    public ResponseEntity<Page<Destino>> getMisDestinosFavoritos(
        @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(favoritoService.getMisDestinosFavoritos(pageable));
    }

    @GetMapping("/mios")
    @Operation(summary = "Obtener IDs de destinos favoritos del usuario autenticado")
    public ResponseEntity<List<Long>> getMisFavoritosIds() {
        return ResponseEntity.ok(favoritoService.getMisFavoritosIds());
    }

    @PostMapping("/{destinoId}")
    @Operation(summary = "Marcar un destino como favorito para el usuario autenticado")
    public ResponseEntity<MensajeResponse> agregarFavorito(@PathVariable Long destinoId) {
        favoritoService.agregarFavorito(destinoId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new MensajeResponse("Destino agregado a favoritos correctamente"));
    }

    @DeleteMapping("/{destinoId}")
    @Operation(summary = "Quitar un destino de favoritos para el usuario autenticado")
    public ResponseEntity<MensajeResponse> eliminarFavorito(@PathVariable Long destinoId) {
        favoritoService.eliminarFavorito(destinoId);
        return ResponseEntity.ok(new MensajeResponse("Destino eliminado de favoritos correctamente"));
    }
}
