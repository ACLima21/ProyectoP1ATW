package com.voyageai.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data @NoArgsConstructor @AllArgsConstructor
public class FavoritoId implements Serializable {

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "destino_id")
    private Long destinoId;
}