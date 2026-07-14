package com.voyageai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "favoritos")
@Data @NoArgsConstructor @AllArgsConstructor
public class Favorito {

    @EmbeddedId
    private FavoritoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("usuarioId")
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("destinoId")
    @JoinColumn(name = "destino_id")
    private Destino destino;

    @Column(name = "fecha_agregado", insertable = false, updatable = false)
    private OffsetDateTime fechaAgregado;
}