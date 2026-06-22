package com.voyageai.backend.service;

import com.voyageai.backend.entity.Stat;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.StatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StatService {

    @Autowired
    private StatRepository statRepository;

    public List<Stat> findAll() {
        return statRepository.findAll();
    }

    public List<Stat> findHeroStats() {
        return statRepository.findByHeroTrue();
    }

    public Stat findById(Long id) {
        return statRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Stat no encontrado con id: " + id));
    }

    public Stat save(Stat stat) {
        return statRepository.save(stat);
    }

    public Stat update(Long id, Stat details) {
        Stat stat = findById(id);
        stat.setVal(details.getVal());
        stat.setLabel(details.getLabel());
        stat.setCounterTarget(details.getCounterTarget());
        stat.setSuffix(details.getSuffix());
        stat.setPrefix(details.getPrefix());
        stat.setHero(details.getHero());
        return statRepository.save(stat);
    }

    public void delete(Long id) {
        findById(id);
        statRepository.deleteById(id);
    }
}