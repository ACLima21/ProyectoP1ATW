package com.voyageai.backend.service;

import com.voyageai.backend.entity.Itinerario;
import com.voyageai.backend.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/*
 * OllamaService — integración con un modelo de lenguaje local vía Ollama.
 *
 * Ollama expone su propia API HTTP en http://localhost:11434 (por defecto).
 * Este service arma un prompt a partir de los datos reales del itinerario
 * y le pide al modelo que redacte un resumen breve y personalizado.
 *
 * No requiere ninguna dependencia nueva en el pom.xml: RestTemplate ya
 * viene incluido con spring-boot-starter-web.
 *
 * Config (opcional, con valores por defecto listos para usar):
 *   ollama.base-url  → http://localhost:11434
 *   ollama.model     → llama3.2
 * Si quieres poder cambiarlos sin recompilar, agrega en application.properties:
 *   ollama.base-url=${OLLAMA_BASE_URL:http://localhost:11434}
 *   ollama.model=${OLLAMA_MODEL:llama3.2}
 * y en tu .env: OLLAMA_BASE_URL=... / OLLAMA_MODEL=...
 */
@Slf4j
@Service
public class OllamaService {

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3.2}")
    private String ollamaModel;

    // Timeouts explícitos: los modelos locales pueden tardar varios segundos
    // en responder, pero no queremos que una petición se quede colgada para
    // siempre si Ollama no está corriendo.
    private final RestTemplate restTemplate = crearRestTemplateConTimeout();

    private static RestTemplate crearRestTemplateConTimeout() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);   // 5s para conectar
        factory.setReadTimeout(60_000);     // 60s para que el modelo termine de generar
        return new RestTemplate(factory);
    }

    /**
     * Genera un resumen descriptivo y personalizado del itinerario usando
     * el modelo local de Ollama. Lanza BusinessException si Ollama no
     * responde (no está corriendo, timeout, etc.) — el llamador decide
     * qué hacer con ese error (en nuestro caso, se lo mostramos al usuario
     * sin afectar el itinerario ya creado).
     */
    public String generarResumenItinerario(Itinerario itinerario) {
        String prompt = construirPrompt(itinerario);

        Map<String, Object> body = new HashMap<>();
        body.put("model", ollamaModel);
        body.put("prompt", prompt);
        body.put("stream", false); // false = una sola respuesta completa, no streaming

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        log.info("🤖 Solicitando resumen de IA a Ollama (modelo: {}) para itinerario {}",
            ollamaModel, itinerario.getId());

        Map<String, Object> respuesta;
        try {
            respuesta = restTemplate.postForObject(
                ollamaBaseUrl + "/api/generate", request, Map.class);
        } catch (RestClientException ex) {
            log.error("❌ Error al conectar con Ollama en {}: {}", ollamaBaseUrl, ex.getMessage());
            throw new BusinessException(
                "No se pudo conectar con el modelo de IA local. " +
                "Verifica que Ollama esté corriendo (ollama serve) en " + ollamaBaseUrl);
        }

        if (respuesta == null || respuesta.get("response") == null) {
            throw new BusinessException("Ollama no devolvió una respuesta válida");
        }

        String texto = respuesta.get("response").toString().trim();
        log.info("✅ Resumen de IA generado ({} caracteres)", texto.length());
        return texto;
    }

    // Prompt en español, acotado a un párrafo corto para que el resultado
    // quede bien en la tarjeta de confirmación (no un itinerario día a día,
    // solo un resumen cálido y personalizado).
    private String construirPrompt(Itinerario itinerario) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente de viajes de VoyageAI. Redacta un resumen breve, ")
          .append("cálido y personalizado (máximo 120 palabras, en español, un solo ")
          .append("párrafo, sin encabezados ni listas) para el siguiente viaje:\n\n");

        sb.append("Destino: ").append(itinerario.getDestino().getNombre()).append("\n");
        sb.append("Fechas: del ").append(itinerario.getFechaInicio())
          .append(" al ").append(itinerario.getFechaFin()).append("\n");
        sb.append("Número de personas: ").append(itinerario.getNumPersonas()).append("\n");

        if (itinerario.getPresupuestoTotal() != null) {
            sb.append("Presupuesto aproximado: ").append(itinerario.getPresupuestoTotal())
              .append(" ").append(itinerario.getMoneda()).append("\n");
        }
        if (itinerario.getNotas() != null && !itinerario.getNotas().isBlank()) {
            sb.append("Preferencias del viajero: ").append(itinerario.getNotas()).append("\n");
        }

        return sb.toString();
    }
}