import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCompass, FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const INITIAL = { name: '', email: '', password: '', confirm: '' }

// Calcula la fortaleza de la contraseña — devuelve nivel 1/2/3
function getStrength(password) {
  if (!password) return null
  let score = 0
  if (password.length >= 6)          score++
  if (password.length >= 10)         score++
  if (/[A-Z]/.test(password))        score++
  if (/[0-9]/.test(password))        score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 1, label: 'Débil',  color: '#EF4444' }
  if (score <= 3) return { level: 2, label: 'Media',  color: '#F59E0B' }
  return              { level: 3, label: 'Fuerte', color: '#10B981' }
}

export default function Registro() {
  const [form,         setForm]         = useState(INITIAL)
  const [errors,       setErrors]       = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const { register, loading }           = useAuth()
  const navigate                        = useNavigate()

  const strength = getStrength(form.password)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev  => ({ ...prev,  [name]: value }))
    setErrors(prev => ({ ...prev, [name]: ''    }))
  }

const validate = () => {
const e = {}
if (form.name.trim().length < 2)                        e.name     = 'Mínimo 2 caracteres'
if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))   e.email    = 'Email inválido'
if (form.password.length < 6)                           e.password = 'Mínimo 6 caracteres'
if (form.password !== form.confirm)                     e.confirm  = 'Las contraseñas no coinciden'
return e
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const result = await register(form.name, form.email, form.password)
    if (result.success) navigate('/')
  }

  return (
    <div className="auth-page">

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
            <div className="auth-panel-badge">✦ Únete gratis hoy</div>
            <h2 className="auth-panel-title">
              Empieza a<br />
              <span className="text-gradient">explorar</span><br />
              el mundo
            </h2>
            <p className="auth-panel-desc">
              Crea tu cuenta y accede a itinerarios personalizados,
              destinos exclusivos y mucho más.
            </p>
            <div className="auth-benefits">
              {[
                'Itinerarios generados por IA',
                'Acceso a 150+ destinos',
                'Alertas de precios en tiempo real',
              ].map(b => (
                <div key={b} className="auth-benefit">
                  <div className="auth-benefit-check"><FiCheck /></div>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="auth-form-wrap">
          <div className="auth-form-card">
            <h1 className="auth-title">Crear cuenta</h1>
            <p className="auth-subtitle">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="auth-link">Inicia sesión</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>

              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre completo</label>
                <div className="input-icon-wrap">
                  <FiUser className="input-icon" />
                  <input id="name" name="name" type="text"
                    className={`form-control input-with-icon ${errors.name ? 'error' : ''}`}
                    placeholder="Tu nombre" value={form.name} onChange={handleChange}
                    autoComplete="name" />
                </div>
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input id="email" name="email" type="email"
                    className={`form-control input-with-icon ${errors.email ? 'error' : ''}`}
                    placeholder="tuemail@ejemplo.com" value={form.email} onChange={handleChange}
                    autoComplete="email" />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                    placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange}
                    autoComplete="new-password" />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShowPassword(s => !s)} aria-label="Ver contraseña">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}

                {/* Indicador de fortaleza */}
                {strength && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="strength-bar"
                          style={{ background: i <= strength.level ? strength.color : 'var(--dark-border)' }} />
                      ))}
                    </div>
                    <span style={{ color: strength.color, fontSize: '0.78rem', fontWeight: 600 }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm">Confirmar contraseña</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input id="confirm" name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`form-control input-with-icon input-with-icon-right ${errors.confirm ? 'error' : ''}`}
                    placeholder="Repite tu contraseña" value={form.confirm} onChange={handleChange}
                    autoComplete="new-password" />
                  <button type="button" className="input-icon-right"
                    onClick={() => setShowConfirm(s => !s)} aria-label="Ver confirmación">
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirm && <p className="form-error">{errors.confirm}</p>}
              </div>

              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={loading}>
                {loading
                  ? <><span className="auth-spinner" /> Creando cuenta...</>
                  : 'Crear cuenta gratis'
                }
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}