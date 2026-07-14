package com.voyageai.backend.controller;

import com.voyageai.backend.dto.LoginRequest;
import com.voyageai.backend.dto.MensajeResponse;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
@Tag(name = "Autenticación", description = "Login e identificación del usuario")
public class AuthController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica al usuario y devuelve su información. Para usar el resto de la API, utiliza el botón Authorize con las mismas credenciales.")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
            );

            Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo()).orElseThrow();
            log.info("🔐 Login exitoso: {}", request.getCorreo());

            return ResponseEntity.ok(Map.of(
                "mensaje", "Login exitoso",
                "id",      usuario.getId(),
                "nombre",  usuario.getNombre(),
                "correo",  usuario.getCorreo(),
                "rol",     usuario.getRol(),
                "avatar",  usuario.getAvatar() != null ? usuario.getAvatar() : ""
            ));
        } catch (AuthenticationException ex) {
            log.warn("❌ Login fallido para: {}", request.getCorreo());
            throw new BusinessException("Correo o contraseña incorrectos");
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener usuario autenticado", description = "Devuelve la información del usuario que está autenticado actualmente")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }
        Usuario usuario = usuarioRepository.findByCorreo(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "id",     usuario.getId(),
            "nombre", usuario.getNombre(),
            "correo", usuario.getCorreo(),
            "rol",    usuario.getRol()
        ));
    }
}