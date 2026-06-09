import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/*
 * Bloquea login y registro si ya estás logueado.
 * Un usuario autenticado no tiene nada que hacer en /login.
 */
export default function GuestGuard({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}