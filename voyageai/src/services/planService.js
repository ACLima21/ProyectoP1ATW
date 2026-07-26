import { get } from './api.js'

export const planService = {
  // GET /api/planes/todos → List<PlanSuscripcion> (sin paginación, endpoint público)
  getTodos: () => get('/planes/todos'),
}