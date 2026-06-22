package com.voyageai.backend.service;

import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.DestinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DestinoService {

    @Autowired
    private DestinoRepository destinoRepository;

    public List<Destino> findAll() {
        return destinoRepository.findAll();
    }

    public Destino findById(Long id) {
        return destinoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado con id: " + id));
    }

    public List<Destino> searchByName(String name) {
        return destinoRepository.findByNameContainingIgnoreCase(name);
    }

    public Destino save(Destino destino) {
        return destinoRepository.save(destino);
    }

    public Destino update(Long id, Destino details) {
        Destino destino = findById(id);
        destino.setImgKey(details.getImgKey());
        destino.setName(details.getName());
        destino.setPlace(details.getPlace());
        destino.setPrice(details.getPrice());
        destino.setTags(details.getTags());
        destino.setDescripcion(details.getDescripcion());
        return destinoRepository.save(destino);
    }

    public void delete(Long id) {
        findById(id);
        destinoRepository.deleteById(id);
    }
}