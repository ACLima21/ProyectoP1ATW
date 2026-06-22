package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "val", length = 20)
    private String val;

    @NotBlank(message = "La etiqueta es obligatoria")
    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "counter_target")
    private Integer counterTarget;

    @Column(name = "suffix", length = 10)
    private String suffix;

    @Column(name = "prefix", length = 10)
    private String prefix;

    @Column(name = "hero")
    private Boolean hero = false;
}