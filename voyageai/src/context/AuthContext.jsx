import { createContext, useContext, useState, useEffect } from 'react'
import usuariosData from '../data/usuarios.json'

/*
 * AuthContext — autenticación contra usuarios.json
 *
 * En producción este archivo se reemplaza por llamadas reales:
 * login    → POST /api/auth/login
 * register → POST /api/auth/register
 *
 * El resto de la app no cambia — solo el interior de estas funciones.
 */

const AuthContext = createContext(null)

const simulateApi = (ms = 1200) => new Promise(r => setTimeout(r, ms))

// Campos que SÍ se guardan en localStorage — nunca la password
const SAFE_FIELDS = ['id', 'nombre', 'correo', 'rol', 'avatar', 'fechaRegistro']

function sanitizeUser(user) {
  return SAFE_FIELDS.reduce((acc, key) => {
    acc[key] = user[key]
    return acc
  }, {})
}

function getStoredUser() {
  try {
    const stored = localStorage.getItem('voyageai-user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(getStoredUser)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('voyageai-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('voyageai-user')
    }
  }, [user])

  // ── LOGIN — busca el correo y valida la contraseña en el JSON ──
  const login = async (correo, password) => {
    setLoading(true)
    try {
      await simulateApi()

      const encontrado = usuariosData.find(
        u => u.correo === correo && u.password === password
      )

      if (!encontrado) {
        throw new Error('Correo o contraseña incorrectos')
      }

      // Guarda solo los campos seguros, nunca la password
      setUser(sanitizeUser(encontrado))
      return { success: true, rol: encontrado.rol }

    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // ── REGISTER — verifica que el correo no exista ya ──
  const register = async (nombre, correo, password) => {
    setLoading(true)
    try {
      await simulateApi()

      const existe = usuariosData.find(u => u.correo === correo)
      if (existe) {
        throw new Error('Ya existe una cuenta con ese correo')
      }

      // Simula el nuevo usuario que devolvería el backend
      const nuevoUsuario = {
        id:             Date.now(),
        nombre,
        correo,
        rol:            'usuario',       // rol por defecto al registrarse
        avatar:         nombre.slice(0, 2).toUpperCase(),
        fechaRegistro:  new Date().toISOString().split('T')[0],
      }

      setUser(nuevoUsuario)
      return { success: true }

    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => setUser(null)

  // Helper para verificar roles desde cualquier componente
  const isAdmin   = user?.rol === 'administrador'
  const isUsuario = user?.rol === 'usuario'

  return (
    <AuthContext.Provider value={{
      user,
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