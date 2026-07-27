package com.voyageai.backend.service;

import com.voyageai.backend.entity.PlanSuscripcion;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.PlanSuscripcionRepository;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
public class UsuarioService {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PlanSuscripcionRepository planSuscripcionRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<Usuario> findAll() { return usuarioRepository.findAll(); }

    public Page<Usuario> findAll(Pageable pageable) { return usuarioRepository.findAll(pageable); }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public List<Usuario> findByRol(String rol) { return usuarioRepository.findByRol(rol); }

    @Transactional
    public Usuario registrar(Usuario usuario) {
        log.info("📝 Registrando nuevo usuario: {}", usuario.getCorreo());
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new BusinessException("Ya existe un usuario con el correo: " + usuario.getCorreo());
        }
        // Hashear la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setFechaRegistro(LocalDate.now());
        usuario.setActivo(true);
        if (usuario.getRol() == null) usuario.setRol("usuario");
        Usuario saved = usuarioRepository.save(usuario);
        log.info("✅ Usuario registrado con ID: {}", saved.getId());
        return saved;
    }

    @Transactional
    public Usuario actualizar(Long id, Usuario datos) {
        log.info("✏️ Actualizando usuario: {}", id);
        Usuario usuario = findById(id);
        usuario.setNombre(datos.getNombre());
        usuario.setRol(datos.getRol());
        usuario.setAvatar(datos.getAvatar());
        usuario.setPlan(datos.getPlan());
        return usuarioRepository.save(usuario);
    }

    /*
     * Auto-asignación de plan (MVP sin pasarela de pago real).
     *
     * A propósito NO reutiliza actualizar(id, datos) ni el PUT genérico:
     * ese endpoint es solo-ADMIN y acepta cualquier campo del usuario
     * (incluido el rol). Este método solo toca el plan, y solo del usuario
     * que llegó autenticado — nunca de otro usuario por ID.
     */
    @Transactional
    public Usuario asignarPlanPropio(String correo, Long planId) {
        log.info("💳 Asignando plan {} al usuario con correo: {}", planId, correo);

        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario no encontrado con correo: " + correo));

        PlanSuscripcion plan = planSuscripcionRepository.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Plan no encontrado con id: " + planId));

        if (!Boolean.TRUE.equals(plan.getActivo())) {
            throw new BusinessException("El plan seleccionado no está disponible: " + plan.getNombre());
        }

        usuario.setPlan(plan);
        Usuario saved = usuarioRepository.save(usuario);
        log.info("✅ Usuario {} ahora tiene el plan: {}", correo, plan.getNombre());
        return saved;
    }

    @Transactional
    public void desactivar(Long id) {
        log.info("🗑️ Desactivando usuario: {}", id);
        Usuario usuario = findById(id);
        // Eliminación lógica — el historial de viajes se conserva
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
        log.info("✅ Usuario desactivado: {}", id);
    }
}