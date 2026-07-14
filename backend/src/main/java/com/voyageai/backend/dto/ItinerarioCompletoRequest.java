package com.voyageai.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class ItinerarioCompletoRequest {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "El ID del destino es obligatorio")
    private Long destinoId;

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, message = "El título debe tener al menos 3 caracteres")
    private String titulo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate fechaFin;

    @Min(value = 1, message = "Debe haber al menos 1 persona")
    private Integer numPersonas = 1;

    private BigDecimal presupuestoTotal;
    private String moneda = "USD";
    private Boolean generadoPorIa = false;
    private String notas;

    @Valid
    private List<ActividadRequest> actividades;
}