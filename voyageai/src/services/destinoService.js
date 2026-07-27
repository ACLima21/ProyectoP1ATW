import { get } from './api.js'

export const destinoService = {
  // Todos los destinos (incluye inactivos) — requiere auth — para admin
  getAll: ({ page = 0, size = 150 } = {}) =>
    get('/destinos', { page, size }),

  // Solo destinos activos — endpoint público — para uso general
  getActivos: ({ page = 0, size = 150 } = {}) =>
    get('/destinos/activos', { page, size }),

  // Destinos fijos para el carrusel de la landing — endpoint público.
  // Devuelve un array plano (List<Destino>), NO un Page — siempre los mismos
  // 5 destinos definidos en el backend (DestinoService.CAROUSEL_IDS).
  getCarousel: () => get('/destinos/carousel'),

  buscar: ({ nombre, page = 0, size = 150 } = {}) =>
    get('/destinos/buscar', { nombre, page, size }),

  getById: (id) => get(`/destinos/${id}`),
}