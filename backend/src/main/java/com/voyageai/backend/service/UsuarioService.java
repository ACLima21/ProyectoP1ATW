package com.voyageai.backend.service;

import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    public List<Usuario> findByRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario save(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + usuario.getCorreo());
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario details) {
        Usuario usuario = findById(id);
        usuario.setNombre(details.getNombre());
        usuario.setRol(details.getRol());
        usuario.setAvatar(details.getAvatar());
        usuario.setPlan(details.getPlan());
        return usuarioRepository.save(usuario);
    }

    public void delete(Long id) {
        findById(id);
        usuarioRepository.deleteById(id);
    }

    // Login simulado — compara correo y password en la base de datos
    public Map<String, Object> login(String correo, String password) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResourceNotFoundException("Credenciales incorrectas"));
        if (!usuario.getPassword().equals(password)) {
            throw new RuntimeException("Credenciales incorrectas");
        }
        return Map.of(
            "id",     usuario.getId(),
            "nombre", usuario.getNombre(),
            "correo", usuario.getCorreo(),
            "rol",    usuario.getRol(),
            "avatar", usuario.getAvatar() != null ? usuario.getAvatar() : ""
        );
    }
}