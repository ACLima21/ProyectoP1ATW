package com.voyageai.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI voyageAIOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("VoyageAI API")
                .description("API REST para la plataforma de planificación de viajes con IA")
                .version("1.0.0")
                .contact(new Contact()
                    .name("VoyageAI Team")
                    .email("hola@voyageai.com")));
    }
}