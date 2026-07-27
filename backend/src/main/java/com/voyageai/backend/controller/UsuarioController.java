package com.voyageai.backend.controller;

import com.voyageai.backend.dto.AsignarPlanRequest;
import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
public class UsuarioController {

    @Autowired private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<Usuario>> getAll(
        @PageableDefault(size = 150) Pageable pageable) {
        return ResponseEntity.ok(usuarioService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @GetMapping("/rol/{rol}")
    @Operation(summary = "Listar usuarios por rol (administrador | usuario)")
    public ResponseEntity<List<Usuario>> getByRol(@PathVariable String rol) {
        return ResponseEntity.ok(usuarioService.findByRol(rol));
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo usuario (ADMIN)")
    public ResponseEntity<Usuario> crear(@Valid @RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(usuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar datos del usuario (ADMIN)")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datos) {
        return ResponseEntity.ok(usuarioService.actualizar(id, datos));
    }

    // Auto-servicio: cualquier usuario autenticado puede cambiar SU PROPIO
    // plan (simulado, sin pasarela de pago). No requiere rol ADMIN porque
    // solo afecta al usuario dueño del token — ver SecurityConfig.
    @PatchMapping("/me/plan")
    @Operation(summary = "Asignar el plan de suscripción al usuario autenticado (simulado, sin pago real)")
    public ResponseEntity<Usuario> asignarMiPlan(
        Authentication authentication,
        @Valid @RequestBody AsignarPlanRequest request) {
        return ResponseEntity.ok(
            usuarioService.asignarPlanPropio(authentication.getName(), request.getPlanId()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar usuario lógicamente (ADMIN)")
    public ResponseEntity<MensajeResponse> desactivar(@PathVariable Long id) {
        usuarioService.desactivar(id);
        return ResponseEntity.ok(new MensajeResponse("Usuario desactivado correctamente"));
    }
}