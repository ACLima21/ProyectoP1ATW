package com.voyageai.backend.service;

import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.entity.Resena;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.BusinessException;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.DestinoRepository;
import com.voyageai.backend.repository.ResenaRepository;
import com.voyageai.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Slf4j
@Service
public class ResenaService {

    @Autowired private ResenaRepository resenaRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private DestinoRepository destinoRepository;

    public List<Resena> findAll()                      { return resenaRepository.findAll(); }
    public List<Resena> findByDestino(Long destinoId)  { return resenaRepository.findByDestinoId(destinoId); }
    public List<Resena> findAprobadas()                { return resenaRepository.findByAprobada(true); }

    public Resena findById(Long id) {
        return resenaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reseña no encontrada con id: " + id));
    }

    @Transactional
    public Resena crear(Resena resena) {
        log.info("⭐ Registrando reseña: usuario={}, destino={}",
            resena.getUsuario().getId(), resena.getDestino().getId());

        // Validar usuario
        Usuario usuario = usuarioRepository.findById(resena.getUsuario().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar destino
        Destino destino = destinoRepository.findById(resena.getDestino().getId())
            .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado"));

        // Un usuario solo puede reseñar un destino una vez
        if (resenaRepository.existsByUsuarioIdAndDestinoId(usuario.getId(), destino.getId())) {
            throw new BusinessException("Ya existe una reseña de este usuario para este destino");
        }

        resena.setUsuario(usuario);
        resena.setDestino(destino);
        resena.setAprobada(false); // requiere aprobación del admin

        Resena saved = resenaRepository.save(resena);
        log.info("✅ Reseña registrada con ID: {}", saved.getId());
        return saved;
    }

    @Transactional
    public Resena aprobar(Long id) {
        log.info("✅ Aprobando reseña: {}", id);
        Resena resena = findById(id);
        resena.setAprobada(true);
        return resenaRepository.save(resena);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("🗑️ Eliminando reseña: {}", id);
        findById(id);
        resenaRepository.deleteById(id);
    }
}