import { post, get } from './api.js'

export const authService = {
  // POST /api/auth/login → { token, id, nombre, correo, rol, avatar }
  login: (correo, password) =>
    post('/auth/login', { correo, password }),

  // POST /api/auth/registro → { token, id, nombre, correo, rol, avatar }
  registro: (datos) =>
    post('/auth/registro', datos),

  // GET /api/auth/me → { id, nombre, correo, rol }
  me: () => get('/auth/me'),
}