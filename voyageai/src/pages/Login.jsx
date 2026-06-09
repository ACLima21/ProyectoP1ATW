import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiCompass } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const INITIAL = { email: '', password: '' }

export default function Login() {
  const [form,         setForm]         = useState(INITIAL)
  const [errors,       setErrors]       = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading }             = useAuth()
  const navigate                        = useNavigate()
  const location                        = useLocation()

  // Si venía de una ruta protegida, vuelve a ella después del login
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '', global: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email    = 'Email inválido'
    if (form.password.length < 6)                         e.password = 'Mínimo 6 caracteres'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const result = await login(form.email, form.password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setErrors({ global: result.error })
    }
  }

  return (
    <div className="auth-page">

      {/* Header mínimo */}
      <header className="auth-header">
        <Link to="/" className="nav-logo">
          <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Voyage<span>AI</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="auth-layout">

        {/* Panel decorativo izquierdo */}
        <div className="auth-panel">
          <div className="auth-panel-bg" />
          <div className="auth-panel-content">
            <div className="auth-panel-badge">✦ Más de 200K viajeros</div>
            <h2 className="auth-panel-title">
              Tu próxima<br />
              <span className="text-gradient">aventura</span><br />
              te espera
            </h2>
            <p className="auth-panel-desc">
              Accede a tu cuenta y continúa planificando
              el viaje de tus sueños con IA.
            </p>
            <div className="auth-testimonial">
              <div className="user-avatar">MR</div>
              <div>
                <strong>María Rodríguez</strong>
                <span>"VoyageAI cambió la forma en que viajo."</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="auth-form-wrap">
          <div className="auth-form-card">
            <h1 className="auth-title">Bienvenido de vuelta</h1>
            <p className="auth-subtitle">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="auth-link">Regístrate gratis</Link>
            </p>

            {/* Error global — credenciales incorrectas */}
            {errors.global && (
              <div className="auth-error-global">⚠️ {errors.global}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input
                    id="email" name="email" type="email"
                    className={`form-control input-with-icon ${errors.email ? 'error' : ''}`}
                    placeholder="tuemail@ejemplo.com"
                    value={form.email} onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <a href="#" className="auth-link" style={{ fontSize: '0.8rem' }}>¿Olvidaste tu contraseña?</a>
                </div>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input
                    id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                    value={form.password} onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={loading}>
                {loading
                  ? <><span className="auth-spinner" /> Iniciando sesión...</>
                  : 'Iniciar sesión'
                }
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}