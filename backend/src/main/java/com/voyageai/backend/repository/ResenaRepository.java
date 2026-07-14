package com.voyageai.backend.repository;
import com.voyageai.backend.entity.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    boolean existsByUsuarioIdAndDestinoId(Long usuarioId, Long destinoId);
    List<Resena> findByDestinoId(Long destinoId);
    List<Resena> findByUsuarioId(Long usuarioId);
    List<Resena> findByAprobada(Boolean aprobada);
}