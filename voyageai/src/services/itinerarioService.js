import { get, post, patch, del } from './api.js'

export const itinerarioService = {
  getAll:          ({ page = 0, size = 150 } = {}) =>
    get('/itinerarios', { page, size }),

  getMisItinerarios: (usuarioId, { page = 0, size = 150 } = {}) =>
    get(`/itinerarios/usuario/${usuarioId}`, { page, size }),

  getById:         (id) => get(`/itinerarios/${id}`),
  getByEstado:     (estado) => get(`/itinerarios/estado/${estado}`),
  getActividades:  (id) => get(`/itinerarios/${id}/actividades`),

  // POST /api/itinerarios/completo — @Transactional en el backend.
  // Un usuario normal solo puede crear el itinerario para sí mismo (el
  // backend ignora el usuarioId si quien llama no es ADMIN).
  crear:           (datos) => post('/itinerarios/completo', datos),

  // Genera (vía Ollama, modelo de IA local) el resumen descriptivo del
  // itinerario y lo guarda. Devuelve el itinerario actualizado, ya con
  // el campo resumenIa lleno.
  generarResumenIa: (id) => post(`/itinerarios/${id}/resumen-ia`, {}),

  actualizarEstado: (id, estado) => patch(`/itinerarios/${id}/estado`, { estado }),
  eliminar:        (id) => del(`/itinerarios/${id}`),
}