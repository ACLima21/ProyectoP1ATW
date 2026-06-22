package com.voyageai.backend.repository;

import com.voyageai.backend.entity.PlanFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanFeatureRepository extends JpaRepository<PlanFeature, Long> {
    List<PlanFeature> findByPlanId(Long planId);
}