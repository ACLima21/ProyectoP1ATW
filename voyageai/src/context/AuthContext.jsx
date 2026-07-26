import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

// Decodifica el payload del JWT sin verificar la firma (la verifica el servidor)
function decodeJwtPayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

// Verifica si el token está expirado en el cliente
function isTokenExpired(token) {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

// Lee sesión guardada de localStorage
function getStoredSession() {
  try {
    const token = localStorage.getItem('voyageai-token')
    const user  = localStorage.getItem('voyageai-user')
    if (!token || !user) return { token: null, user: null }
    if (isTokenExpired(token)) {
      localStorage.removeItem('voyageai-token')
      localStorage.removeItem('voyageai-user')
      return { token: null, user: null }
    }
    return { token, user: JSON.parse(user) }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const stored = getStoredSession()
  const [user,    setUser]    = useState(stored.user)
  const [token,   setToken]   = useState(stored.token)
  const [loading, setLoading] = useState(false)

  // Guarda sesión en localStorage
  const saveSession = useCallback((tokenValue, userData) => {
    localStorage.setItem('voyageai-token', tokenValue)
    localStorage.setItem('voyageai-user',  JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }, [])

  // Limpia sesión
  const clearSession = useCallback(() => {
    localStorage.removeItem('voyageai-token')
    localStorage.removeItem('voyageai-user')
    setToken(null)
    setUser(null)
  }, [])

  // Login — llama al backend, recibe JWT y lo guarda
  const login = useCallback(async (correo, password) => {
    setLoading(true)
    try {
      const data = await authService.login(correo, password)
      const userData = {
        id:     data.id,
        nombre: data.nombre,
        correo: data.correo,
        rol:    data.rol,
        avatar: data.avatar,
      }
      saveSession(data.token, userData)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Credenciales incorrectas' }
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  // Registro — crea cuenta en backend y logea automáticamente
  const register = useCallback(async (nombre, correo, password) => {
    setLoading(true)
    try {
      const data = await authService.registro({
        nombre,
        correo,
        password,
        avatar: nombre.slice(0, 2).toUpperCase(),
      })
      const userData = {
        id:     data.id,
        nombre: data.nombre,
        correo: data.correo,
        rol:    data.rol,
        avatar: data.avatar,
      }
      saveSession(data.token, userData)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message || 'Error al registrar' }
    } finally {
      setLoading(false)
    }
  }, [saveSession])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const isAdmin   = user?.rol === 'administrador'
  const isUsuario = user?.rol === 'usuario'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAdmin,
      isUsuario,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}