package com.voyageai.backend.config;

import com.voyageai.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // ── Swagger ────────────────────────────────────────
                .requestMatchers(
                    "/swagger-ui/**", "/swagger-ui.html",
                    "/api-docs/**",  "/v3/api-docs/**"
                ).permitAll()

                // ── Endpoints públicos ─────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/destinos/activos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/destinos/buscar").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/destinos/carousel").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/planes/todos").permitAll()

                // ── GET autenticado ────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/**").authenticated()

                // ── Escritura permitida a CUALQUIER usuario autenticado
                //    (no solo ADMIN) — la protección contra abuso vive en
                //    el service, no aquí:
                //    - POST /api/itinerarios/completo: un usuario normal
                //      solo puede crear itinerarios para SÍ MISMO
                //      (ItinerarioService ignora el usuarioId del body si
                //      quien llama no es admin). Un admin puede crear para
                //      cualquier usuario, igual que antes.
                //    - PATCH /api/usuarios/me/plan: el usuario solo puede
                //      cambiar SU PROPIO plan (no toca otros campos ni
                //      otros usuarios).
                // Deben ir ANTES de las reglas genéricas de ADMIN de abajo,
                // porque Spring Security usa la primera regla que matchee.
                .requestMatchers(HttpMethod.POST,  "/api/itinerarios/completo").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/usuarios/me/plan").authenticated()
                // El asterisco matchea el {id} del itinerario — la protección de que
                // solo el dueño (o un admin) pueda generarlo vive en ItinerarioService.
                .requestMatchers(HttpMethod.POST,  "/api/itinerarios/*/resumen-ia").authenticated()

                // ── Escritura solo ADMIN (todo lo demás) ───────────
                .requestMatchers(HttpMethod.POST,   "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,  "/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            // JWT va antes del filtro de usuario/contraseña estándar
            .addFilterBefore(jwtAuthenticationFilter,
                             UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:3000"
        ));
        config.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
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