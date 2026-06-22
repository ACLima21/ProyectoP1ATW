package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "features")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "icon_key", length = 50)
    private String iconKey;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "bg", length = 50)
    private String bg;

    @NotBlank(message = "El título es obligatorio")
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
}