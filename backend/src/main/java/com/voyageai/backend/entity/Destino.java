package com.voyageai.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "destinos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Destino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "img_key", length = 50)
    private String imgKey;

    @NotBlank(message = "El nombre del destino es obligatorio")
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "place", length = 150)
    private String place;

    @Column(name = "price", length = 50)
    private String price;

    @Column(name = "tags", length = 255)
    private String tags; // "Cultural,Gastronomía"

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
}