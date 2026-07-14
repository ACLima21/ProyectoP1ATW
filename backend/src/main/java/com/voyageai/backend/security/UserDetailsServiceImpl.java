package com.voyageai.backend.security;

import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        log.debug("🔍 Intentando autenticar usuario: {}", correo);

        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> {
                log.warn("❌ Usuario no encontrado: {}", correo);
                return new UsernameNotFoundException("Usuario no encontrado: " + correo);
            });

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            log.warn("⛔ Usuario desactivado: {}", correo);
            throw new UsernameNotFoundException("Usuario desactivado: " + correo);
        }

        // Mapea el rol de la BD al formato que Spring Security espera (ROLE_xxx)
        String role = usuario.getRol().equalsIgnoreCase("administrador")
            ? "ROLE_ADMIN"
            : "ROLE_USER";

        log.debug("✅ Usuario autenticado: {} con rol: {}", correo, role);

        return User.builder()
            .username(usuario.getCorreo())
            .password(usuario.getPassword())
            .authorities(role)
            .build();
    }
}