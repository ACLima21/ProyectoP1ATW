package com.voyageai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "planes_suscripcion")
// Evita que Jackson intente serializar propiedades internas del proxy de
// Hibernate (hibernateLazyInitializer/handler) cuando esta entidad se
// accede como una relación LAZY desde otra (ej. Usuario.plan).
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data @NoArgsConstructor @AllArgsConstructor
public class PlanSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del plan es obligatorio")
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "precio_mensual", nullable = false)
    private BigDecimal precioMensual = BigDecimal.ZERO;

    @Column(name = "precio_anual", nullable = false)
    private BigDecimal precioAnual = BigDecimal.ZERO;

    @Column(name = "descuento_anual")
    private Integer descuentoAnual = 0;

    @Column(name = "max_itinerarios")
    private Integer maxItinerarios = 3;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "destacado")
    private Boolean destacado = false;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}