/*
 * api.js — Cliente HTTP base para VoyageAI
 *
 * Centraliza la URL base y el encabezado Authorization con JWT.
 * Todos los servicios importan de aquí en lugar de usar fetch directamente.
 *
 * Antes: fetch('/src/data/destinos.json')     ← datos locales
 * Ahora: get('/destinos/activos')              ← API REST real
 */

const BASE_URL = 'http://localhost:8080/api'

// Lee el token del localStorage para incluirlo en cada petición
function getHeaders() {
  const token = localStorage.getItem('voyageai-token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

// Maneja errores HTTP de manera uniforme
async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: `Error HTTP ${res.status}`
    }))
    throw error
  }
  if (res.status === 204) return null
  return res.json()
}

export async function get(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.append(k, v)
  })
  const res = await fetch(url.toString(), { headers: getHeaders() })
  return handleResponse(res)
}

export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function put(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function patch(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return handleResponse(res)
}