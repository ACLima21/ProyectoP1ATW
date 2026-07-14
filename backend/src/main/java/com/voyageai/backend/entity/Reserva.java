package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "reservas")
@Data @NoArgsConstructor @AllArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerario_id", nullable = false, unique = true)
    private Itinerario itinerario;

    @NotBlank(message = "El código de reserva es obligatorio")
    @Column(name = "codigo_reserva", nullable = false, unique = true, length = 20)
    private String codigoReserva;

    @Column(name = "estado", length = 50)
    private String estado = "pendiente";

    @NotNull(message = "El monto total es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    @Column(name = "monto_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "moneda", length = 10)
    private String moneda = "USD";

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @Column(name = "fecha_reserva", insertable = false, updatable = false)
    private OffsetDateTime fechaReserva;

    @Column(name = "fecha_confirmacion")
    private OffsetDateTime fechaConfirmacion;

    @Column(name = "fecha_cancelacion")
    private OffsetDateTime fechaCancelacion;

    @Column(name = "motivo_cancelacion", columnDefinition = "TEXT")
    private String motivoCancelacion;

    @Column(name = "notas", columnDefinition = "TEXT")
    private String notas;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}