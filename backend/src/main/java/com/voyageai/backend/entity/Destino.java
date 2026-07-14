package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "destinos")
@Data @NoArgsConstructor @AllArgsConstructor
public class Destino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "img_key", length = 50)
    private String imgKey;

    @NotBlank(message = "El nombre del destino es obligatorio")
    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "ciudad", length = 100)
    private String ciudad;

    @NotBlank(message = "El país es obligatorio")
    @Column(name = "pais", nullable = false, length = 100)
    private String pais;

    @Column(name = "region", length = 150)
    private String region;

    @Column(name = "continente", length = 100)
    private String continente;

    @Column(name = "precio_desde", precision = 10, scale = 2)
    private BigDecimal precioDesde;

    @Column(name = "moneda", length = 10)
    private String moneda = "USD";

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "clima", length = 100)
    private String clima;

    @Column(name = "idioma_principal", length = 100)
    private String idiomaPrincipal;

    @Column(name = "zona_horaria", length = 50)
    private String zonaHoraria;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;
}