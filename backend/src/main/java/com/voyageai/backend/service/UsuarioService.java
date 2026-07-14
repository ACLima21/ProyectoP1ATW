package com.voyageai.backend.service;

import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
public class UsuarioService {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<Usuario> findAll() { return usuarioRepository.findAll(); }

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