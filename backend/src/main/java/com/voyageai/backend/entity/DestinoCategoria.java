package com.voyageai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "destino_categorias")
@Data @NoArgsConstructor @AllArgsConstructor
public class DestinoCategoria {

    @EmbeddedId
    private DestinoCategoriaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("destinoId")
    @JoinColumn(name = "destino_id")
    private Destino destino;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoriaId")
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}