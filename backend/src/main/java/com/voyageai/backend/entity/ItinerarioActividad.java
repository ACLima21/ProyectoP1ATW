package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "itinerario_actividades")
@Data @NoArgsConstructor @AllArgsConstructor
public class ItinerarioActividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerario_id", nullable = false)
    private Itinerario itinerario;

    @Min(value = 1, message = "El número de día debe ser al menos 1")
    @Column(name = "dia_numero", nullable = false)
    private Integer diaNumero;

    @Min(value = 1, message = "El orden debe ser al menos 1")
    @Column(name = "orden")
    private Integer orden = 1;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @NotBlank(message = "El título de la actividad es obligatorio")
    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "tipo", length = 50)
    private String tipo = "turismo";

    @Column(name = "lugar", length = 200)
    private String lugar;

    @Column(name = "costo_estimado", precision = 10, scale = 2)
    private BigDecimal costoEstimado = BigDecimal.ZERO;

    @Column(name = "moneda", length = 10)
    private String moneda = "USD";

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}