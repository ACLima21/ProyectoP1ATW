package com.voyageai.backend.repository;

import com.voyageai.backend.entity.Stat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatRepository extends JpaRepository<Stat, Long> {
    List<Stat> findByHeroTrue();
}