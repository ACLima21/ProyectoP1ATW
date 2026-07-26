package com.voyageai.backend.controller;

import com.voyageai.backend.dto.LoginRequest;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.repository.UsuarioRepository;
import com.voyageai.backend.security.JwtUtil;
import com.voyageai.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "Login, registro e identidad del usuario")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private UsuarioService usuarioService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión — devuelve JWT")
    public ResponseEntity<Map<String, Object>> login(
        @Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getCorreo(), request.getPassword())
            );

            Usuario usuario = usuarioRepository
                .findByCorreo(request.getCorreo()).orElseThrow();

            String token = jwtUtil.generateToken(
                usuario.getCorreo(), usuario.getRol());

            log.info("🔐 Login exitoso: {}", request.getCorreo());

            return ResponseEntity.ok(Map.of(
                "token",   token,
                "tipo",    "Bearer",
                "id",      usuario.getId(),
                "nombre",  usuario.getNombre(),
                "correo",  usuario.getCorreo(),
                "rol",     usuario.getRol(),
                "avatar",  usuario.getAvatar() != null ? usuario.getAvatar() : ""
            ));

        } catch (AuthenticationException ex) {
            log.warn("❌ Login fallido: {}", request.getCorreo());
            throw new BusinessException("Correo o contraseña incorrectos");
        }
    }

    @PostMapping("/registro")
    @Operation(summary = "Registro público — crea cuenta y devuelve JWT")
    public ResponseEntity<Map<String, Object>> registro(
        @Valid @RequestBody Usuario nuevoUsuario) {

        // El registro público siempre crea rol usuario (nunca admin)
        nuevoUsuario.setRol("usuario");

        Usuario creado = usuarioService.registrar(nuevoUsuario);
        String token   = jwtUtil.generateToken(creado.getCorreo(), creado.getRol());

        log.info("✅ Nuevo usuario registrado: {}", creado.getCorreo());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "token",   token,
            "tipo",    "Bearer",
            "id",      creado.getId(),
            "nombre",  creado.getNombre(),
            "correo",  creado.getCorreo(),
            "rol",     creado.getRol(),
            "avatar",  creado.getAvatar() != null ? creado.getAvatar() : ""
        ));
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener usuario autenticado actual")
    public ResponseEntity<Map<String, Object>> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401)
                .body(Map.of("error", "No autenticado"));
        }
        Usuario usuario = usuarioRepository.findByCorreo(auth.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "id",     usuario.getId(),
            "nombre", usuario.getNombre(),
            "correo", usuario.getCorreo(),
            "rol",    usuario.getRol(),
            "avatar", usuario.getAvatar() != null ? usuario.getAvatar() : ""
        ));
    }
}