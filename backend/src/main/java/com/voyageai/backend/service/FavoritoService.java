package com.voyageai.backend.service;

import com.voyageai.backend.entity.Destino;
import com.voyageai.backend.entity.Favorito;
import com.voyageai.backend.entity.FavoritoId;
import com.voyageai.backend.entity.Usuario;
import com.voyageai.backend.exception.ResourceNotFoundException;
import com.voyageai.backend.repository.DestinoRepository;
import com.voyageai.backend.repository.FavoritoRepository;
import com.voyageai.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoritoService {

    @Autowired private FavoritoRepository favoritoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private DestinoRepository destinoRepository;

    private Usuario getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceNotFoundException("Usuario no autenticado");
        }
        String correo = auth.getName();
        return usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + correo));
    }

    @Transactional(readOnly = true)
    public List<Long> getMisFavoritosIds() {
        Usuario usuario = getUsuarioAutenticado();
        return favoritoRepository.findByIdUsuarioId(usuario.getId())
            .stream()
            .map(f -> f.getId().getDestinoId())
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<Destino> getMisDestinosFavoritos(Pageable pageable) {
        Usuario usuario = getUsuarioAutenticado();
        Page<Favorito> favoritosPage = favoritoRepository.findByIdUsuarioId(usuario.getId(), pageable);
        return favoritosPage.map(Favorito::getDestino);
    }

    @Transactional
    public void agregarFavorito(Long destinoId) {
        Usuario usuario = getUsuarioAutenticado();
        Destino destino = destinoRepository.findById(destinoId)
            .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado con id: " + destinoId));

        FavoritoId id = new FavoritoId(usuario.getId(), destinoId);
        if (!favoritoRepository.existsById(id)) {
            Favorito favorito = new Favorito();
            favorito.setId(id);
            favorito.setUsuario(usuario);
            favorito.setDestino(destino);
            favoritoRepository.save(favorito);
        }
    }

    @Transactional
    public void eliminarFavorito(Long destinoId) {
        Usuario usuario = getUsuarioAutenticado();
        FavoritoId id = new FavoritoId(usuario.getId(), destinoId);
        if (favoritoRepository.existsById(id)) {
            favoritoRepository.deleteById(id);
        }
    }
}
