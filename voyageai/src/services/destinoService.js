import { get } from './api.js'

export const destinoService = {
  // Todos los destinos (incluye inactivos) — requiere auth — para admin
  getAll: ({ page = 0, size = 150 } = {}) =>
    get('/destinos', { page, size }),

  // Solo destinos activos — endpoint público — para landing/carousel
  getActivos: ({ page = 0, size = 150 } = {}) =>
    get('/destinos/activos', { page, size }),

  buscar: ({ nombre, page = 0, size = 150 } = {}) =>
    get('/destinos/buscar', { nombre, page, size }),

  getById: (id) => get(`/destinos/${id}`),
}