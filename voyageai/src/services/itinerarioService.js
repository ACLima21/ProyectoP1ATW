import { get, post, patch, del } from './api.js'

export const itinerarioService = {
  // GET /api/itinerarios/usuario/{id}?page=0&size=150
  getMisItinerarios: (usuarioId, { page = 0, size = 150 } = {}) =>
    get(`/itinerarios/usuario/${usuarioId}`, { page, size }),

  // GET /api/itinerarios/{id}
  getById: (id) => get(`/itinerarios/${id}`),

  // GET /api/itinerarios/{id}/actividades
  getActividades: (id) => get(`/itinerarios/${id}/actividades`),

  // POST /api/itinerarios/completo
  crear: (datos) => post('/itinerarios/completo', datos),

  // PATCH /api/itinerarios/{id}/estado
  actualizarEstado: (id, estado) =>
    patch(`/itinerarios/${id}/estado`, { estado }),

  // DELETE /api/itinerarios/{id}
  eliminar: (id) => del(`/itinerarios/${id}`),
}