import { get, post, del } from './api.js'

export const favoritoService = {
  getMisFavoritos: ({ page = 0, size = 10 } = {}) =>
    get('/favoritos', { page, size }),
  getMisFavoritosIds: () => get('/favoritos/mios'),
  agregarFavorito: (destinoId) => post(`/favoritos/${destinoId}`),
  eliminarFavorito: (destinoId) => del(`/favoritos/${destinoId}`),
}
