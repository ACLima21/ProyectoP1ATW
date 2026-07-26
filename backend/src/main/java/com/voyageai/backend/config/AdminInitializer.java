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
import java.util.List;

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
        log.info("🚀 Verificando administrador inicial...");

        // ── 1. Crear o actualizar el admin ────────────────────
        usuarioRepository.findByCorreo(adminUsername).ifPresentOrElse(
            admin -> {
                if (!admin.getPassword().startsWith("$2a$") &&
                    !admin.getPassword().startsWith("$2b$")) {
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    usuarioRepository.save(admin);
                    log.info("🔄 Contraseña del admin actualizada a BCrypt");
                } else {
                    log.info("✅ Admin ya existe con contraseña hasheada");
                }
            },
            () -> {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador Principal");
                admin.setCorreo(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRol("administrador");
                admin.setAvatar("AP");
                admin.setFechaRegistro(LocalDate.now());
                admin.setActivo(true);
                usuarioRepository.save(admin);
                log.info("✅ Administrador creado: {}", adminUsername);
            }
        );

        // ── 2. Migrar contraseñas en texto plano a BCrypt ─────
        log.info("🔄 Migrando contraseñas sin hashear...");
        List<Usuario> usuarios = usuarioRepository.findAll();
        long migrados = 0;
        for (Usuario u : usuarios) {
            if (!u.getPassword().startsWith("$2a$") &&
                !u.getPassword().startsWith("$2b$")) {
                u.setPassword(passwordEncoder.encode(u.getPassword()));
                usuarioRepository.save(u);
                migrados++;
            }
        }
        if (migrados > 0) {
            log.info("✅ {} contraseñas migradas a BCrypt", migrados);
        } else {
            log.info("✅ Todas las contraseñas ya están hasheadas");
        }
    }
}