package com.voyageai.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class ActividadRequest {

    @Min(value = 1, message = "El día debe ser al menos 1")
    private Integer diaNumero;

    private Integer orden = 1;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    @NotBlank(message = "El título de la actividad es obligatorio")
    private String titulo;

    private String descripcion;
    private String tipo = "turismo";
    private String lugar;
    private BigDecimal costoEstimado = BigDecimal.ZERO;
    private String moneda = "USD";
}