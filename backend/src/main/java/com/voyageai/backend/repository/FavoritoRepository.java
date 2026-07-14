package com.voyageai.backend.repository;
import com.voyageai.backend.entity.Favorito;
import com.voyageai.backend.entity.FavoritoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {
    List<Favorito> findByIdUsuarioId(Long usuarioId);
}