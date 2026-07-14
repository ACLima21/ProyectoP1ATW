package com.voyageai.backend.config;

import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Component
public class AdminInitializer implements ApplicationRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        log.info("🚀 Verificando administrador inicial del sistema...");
        Optional<Usuario> existingAdmin = usuarioRepository.findByCorreo(adminUsername);

        if (existingAdmin.isEmpty()) {
            // Crear el admin desde cero
            Usuario admin = new Usuario();
            admin.setNombre("Administrador Principal");
            admin.setCorreo(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword));  // BCrypt hash
            admin.setRol("administrador");
            admin.setAvatar("AP");
            admin.setFechaRegistro(LocalDate.now());
            admin.setActivo(true);
            usuarioRepository.save(admin);
            log.info("✅ Administrador creado exitosamente: {}", adminUsername);

        } else {
            Usuario admin = existingAdmin.get();
            // Si la contraseña NO es un hash BCrypt, la actualiza
            // Los hashes BCrypt siempre empiezan con $2a$ o $2b$
            if (!admin.getPassword().startsWith("$2a$") &&
                !admin.getPassword().startsWith("$2b$")) {
                admin.setPassword(passwordEncoder.encode(adminPassword));
                usuarioRepository.save(admin);
                log.info("🔄 Contraseña del administrador actualizada a BCrypt: {}", adminUsername);
            } else {
                log.info("✅ Administrador ya existe con contraseña hasheada: {}", adminUsername);
            }
        }
    }
}