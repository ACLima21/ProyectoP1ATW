package com.voyageai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // ── Swagger — público ──────────────────────────────
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api-docs/**",
                    "/v3/api-docs/**"
                ).permitAll()

                // ── Auth — público ─────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()

                // ── GET — cualquier usuario autenticado ────────────
                .requestMatchers(HttpMethod.GET, "/api/**").authenticated()

                // ── POST, PUT, DELETE — solo ADMIN ─────────────────
                .requestMatchers(HttpMethod.POST,   "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,  "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            // HTTP Basic Auth — funciona directamente con el botón Authorize de Swagger
            .httpBasic(basic -> basic.realmName("VoyageAI API"))
            // Sin estado de sesión — cada petición se autentica independientemente
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}