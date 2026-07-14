package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "itinerarios")
@Data @NoArgsConstructor @AllArgsConstructor
public class Itinerario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destino_id", nullable = false)
    private Destino destino;

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, message = "El título debe tener al menos 3 caracteres")
    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Min(value = 1, message = "Debe haber al menos 1 persona")
    @Max(value = 100, message = "Máximo 100 personas")
    @Column(name = "num_personas")
    private Integer numPersonas = 1;

    @Column(name = "presupuesto_total", precision = 12, scale = 2)
    private BigDecimal presupuestoTotal;

    @Column(name = "moneda", length = 10)
    private String moneda = "USD";

    @Column(name = "estado", length = 50)
    private String estado = "borrador";

    @Column(name = "generado_por_ia")
    private Boolean generadoPorIa = false;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}