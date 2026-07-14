package com.voyageai.backend.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class MensajeResponse {
    private String mensaje;
    private Object data;

    public MensajeResponse(String mensaje) {
        this.mensaje = mensaje;
    }
}