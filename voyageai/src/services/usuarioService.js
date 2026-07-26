import { get, post, put, del } from './api.js'

export const usuarioService = {
  getAll:      ({ page = 0, size = 150 } = {}) =>
    get('/usuarios', { page, size }),

  getById:     (id)       => get(`/usuarios/${id}`),
  getByRol:    (rol)      => get(`/usuarios/rol/${rol}`),

  crear:       (datos)    => post('/usuarios', datos),
  actualizar:  (id, datos)=> put(`/usuarios/${id}`, datos),
  desactivar:  (id)       => del(`/usuarios/${id}`),
}