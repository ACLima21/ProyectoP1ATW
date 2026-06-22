package com.voyageai.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "plan_features")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación inversa — @JsonBackReference evita la recursión infinita
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    @JsonBackReference
    private Plan plan;

    @NotBlank(message = "El texto de la característica es obligatorio")
    @Column(name = "texto", nullable = false)
    private String texto;

    @Column(name = "disponible")
    private Boolean disponible = true;
}