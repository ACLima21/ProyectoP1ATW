package com.voyageai.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "planes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del plan es obligatorio")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Min(value = 0, message = "El precio no puede ser negativo")
    @Column(name = "monthly_price", nullable = false)
    private Double monthlyPrice = 0.0;

    @Min(value = 0, message = "El descuento no puede ser negativo")
    @Max(value = 100, message = "El descuento no puede superar el 100%")
    @Column(name = "annual_discount")
    private Integer annualDiscount = 0;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "featured")
    private Boolean featured = false;

    @Column(name = "cta", length = 100)
    private String cta;

    // Relación uno a muchos con PlanFeature
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PlanFeature> features;
}