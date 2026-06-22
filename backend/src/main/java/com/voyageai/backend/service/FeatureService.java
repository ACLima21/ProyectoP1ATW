package com.voyageai.backend.service;

import com.voyageai.backend.entity.Feature;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    public List<Feature> findAll() {
        return featureRepository.findAll();
    }

    public Feature findById(Long id) {
        return featureRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Feature no encontrada con id: " + id));
    }

    public Feature save(Feature feature) {
        return featureRepository.save(feature);
    }

    public Feature update(Long id, Feature details) {
        Feature feature = findById(id);
        feature.setIconKey(details.getIconKey());
        feature.setColor(details.getColor());
        feature.setBg(details.getBg());
        feature.setTitle(details.getTitle());
        feature.setDescripcion(details.getDescripcion());
        return featureRepository.save(feature);
    }

    public void delete(Long id) {
        findById(id);
        featureRepository.deleteById(id);
    }
}