import { get, post, put, patch, del } from './api.js'

export const usuarioService = {
  getAll:      ({ page = 0, size = 150 } = {}) =>
    get('/usuarios', { page, size }),

  getById:     (id)       => get(`/usuarios/${id}`),
  getByRol:    (rol)      => get(`/usuarios/rol/${rol}`),

  crear:       (datos)    => post('/usuarios', datos),
  actualizar:  (id, datos)=> put(`/usuarios/${id}`, datos),
  desactivar:  (id)       => del(`/usuarios/${id}`),

  // Auto-asignación de plan (MVP, sin pasarela de pago real).
  // Siempre actúa sobre el usuario autenticado — no recibe un ID por
  // parámetro porque el backend lo determina desde el JWT.
  asignarPlan: (planId)   => patch('/usuarios/me/plan', { planId }),
}