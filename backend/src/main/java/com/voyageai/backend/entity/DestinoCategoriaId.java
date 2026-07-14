package com.voyageai.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data @NoArgsConstructor @AllArgsConstructor
public class DestinoCategoriaId implements Serializable {

    @Column(name = "destino_id")
    private Long destinoId;

    @Column(name = "categoria_id")
    private Long categoriaId;
}