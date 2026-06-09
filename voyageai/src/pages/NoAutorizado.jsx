import { Link } from 'react-router-dom'
import { FiLock, FiArrowLeft, FiCompass } from 'react-icons/fi'

/*
 * Página que aparece cuando un usuario logueado
 * intenta acceder a una ruta que requiere un rol mayor.
 * Ejemplo: un "usuario" intenta entrar a /admin
 */
export default function NoAutorizado() {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="nav-logo">
          <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Voyage<span>AI</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="confirmacion-card" style={{ textAlign: 'center' }}>

          <div className="confirmacion-icon" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            <FiLock />
          </div>

          <div className="section-tag" style={{ marginBottom: '1rem' }}>Acceso denegado</div>

          <h1 className="confirmacion-title">No tienes<br /><span className="text-gradient">permisos</span></h1>

          <p className="confirmacion-desc">
            Tu cuenta no tiene los permisos necesarios
            para ver esta página.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-outline">
              <FiArrowLeft /> Volver al inicio
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              Ir a mi panel
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}