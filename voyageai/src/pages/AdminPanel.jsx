import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import { FiShield, FiCompass, FiLogOut, FiArrowLeft, FiUsers, FiGlobe, FiCheckCircle } from 'react-icons/fi'

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="auth-page">

      {/* Header */}
      <header className="auth-header">
        <Link to="/" className="nav-logo">
          <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Voyage<span>AI</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          <button className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={handleLogout}>
            <FiLogOut /> Salir
          </button>
        </div>
      </header>

      {/* Contenido central */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
        <div style={{ width: '100%', maxWidth: '560px', textAlign: 'center' }}>

          {/* Ícono de éxito */}
          <div className="admin-shield-icon">
            <FiShield />
          </div>

          <div className="section-tag" style={{ marginBottom: '1rem' }}>
            Acceso verificado
          </div>

          <h1 className="confirmacion-title">
            Panel de<br />
            <span className="text-gradient">Administración</span>
          </h1>

          <p className="confirmacion-desc">
            Ingresaste correctamente como{' '}
            <strong style={{ color: 'var(--primary-light)' }}>{user.nombre}</strong>{' '}
            con rol de <strong style={{ color: 'var(--accent)' }}>administrador</strong>.
            Desde aquí podrás gestionar toda la plataforma.
          </p>

          {/* Accesos rápidos — próximamente */}
          <div className="admin-modules">
            {[
              { icon: <FiUsers />,        label: 'Gestión de usuarios',   desc: 'Próximamente', ready: false },
              { icon: <FiGlobe />,        label: 'Gestión de destinos',   desc: 'Próximamente', ready: false },
              { icon: <FiCheckCircle />,  label: 'Acceso completo',       desc: 'Rol verificado', ready: true  },
            ].map(({ icon, label, desc, ready }) => (
              <div key={label} className={`admin-module-card ${ready ? 'ready' : ''}`}>
                <div className="admin-module-icon"
                  style={{ color: ready ? 'var(--accent2)' : 'var(--text-muted)' }}>
                  {icon}
                </div>
                <strong>{label}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to="/dashboard" className="btn btn-outline">
              <FiArrowLeft /> Mi Dashboard
            </Link>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}