import { post, put, del } from './api.js'

export const adminDestinoService = {
  crear:      (datos)     => post('/destinos', datos),
  actualizar: (id, datos) => put(`/destinos/${id}`, datos),
  desactivar: (id)        => del(`/destinos/${id}`),
}