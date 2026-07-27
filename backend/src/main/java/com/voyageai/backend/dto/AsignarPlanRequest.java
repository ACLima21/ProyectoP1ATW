package com.voyageai.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

// DTO minimalista a propósito: el endpoint /api/usuarios/me/plan solo debe
// poder cambiar el plan del usuario autenticado, nada más. Por eso no se
// reutiliza la entidad Usuario completa como body — así evitamos que alguien
// intente colar cambios de rol, correo, etc. en la misma petición.
@Data @NoArgsConstructor @AllArgsConstructor
public class AsignarPlanRequest {

    @NotNull(message = "El ID del plan es obligatorio")
    private Long planId;
}