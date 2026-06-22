package com.voyageai.backend.service;

import com.voyageai.backend.entity.Plan;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    public List<Plan> findAll() {
        return planRepository.findAll();
    }

    public Plan findById(Long id) {
        return planRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado con id: " + id));
    }

    public Plan save(Plan plan) {
        return planRepository.save(plan);
    }

    public Plan update(Long id, Plan details) {
        Plan plan = findById(id);
        plan.setName(details.getName());
        plan.setMonthlyPrice(details.getMonthlyPrice());
        plan.setAnnualDiscount(details.getAnnualDiscount());
        plan.setDescripcion(details.getDescripcion());
        plan.setFeatured(details.getFeatured());
        plan.setCta(details.getCta());
        return planRepository.save(plan);
    }

    public void delete(Long id) {
        findById(id);
        planRepository.deleteById(id);
    }
}