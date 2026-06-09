import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/*
 * AuthGuard acepta un prop opcional `requiredRole`.
 *
 * Sin requiredRole  → solo verifica que esté logueado
 * Con requiredRole  → verifica además que tenga ese rol específico
 *
 * Uso:
 * <AuthGuard>                              → cualquier usuario logueado
 * <AuthGuard requiredRole="administrador"> → solo admins
 */
export default function AuthGuard({ children, requiredRole }) {
  const { user }  = useAuth()
  const location  = useLocation()

  // No está logueado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Está logueado pero no tiene el rol requerido
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/no-autorizado" replace />
  }

  return children
}