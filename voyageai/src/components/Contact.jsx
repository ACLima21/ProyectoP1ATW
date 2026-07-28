import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Modal from './Modal'
import { useFlow } from '../context/FlowContext'
import { useAuth } from '../context/AuthContext'
import { itinerarioService } from '../services/itinerarioService'

const INITIAL = {
  titulo: '',
  fechaInicio: '',
  fechaFin: '',
  numPersonas: 1,
  presupuestoTotal: '',
  notas: '',
  acepto: false,
}

const HOY = new Date().toISOString().split('T')[0]

export default function Contact() {
  const [form,       setForm]       = useState(INITIAL)
  const [errors,     setErrors]     = useState({})
  const [loading,    setLoading]    = useState(false)
  const [showModal,  setShowModal]  = useState(false)
  const [apiError,   setApiError]   = useState('')

  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    setFormSubmitted,
    destinoSeleccionado, setDestinoSeleccionado,
    setUltimoItinerario,
  } = useFlow()

  const infoRef = useScrollReveal()
  const formRef = useScrollReveal()

  // Precarga el título con el nombre del destino elegido en "Ver ruta",
  // solo si el usuario todavía no escribió uno.
  useEffect(() => {
    if (destinoSeleccionado && !form.titulo) {
      setForm(prev => ({ ...prev, titulo: `Viaje a ${destinoSeleccionado.nombre}` }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinoSeleccionado])

  // Manejar cambios — componentes controlados
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  // Validación
  const validate = () => {
    const e = {}
    if (!form.titulo.trim() || form.titulo.trim().length < 3) {
      e.titulo = 'El título debe tener al menos 3 caracteres'
    }
    if (!form.fechaInicio) e.fechaInicio = 'Selecciona la fecha de inicio'
    if (!form.fechaFin)    e.fechaFin    = 'Selecciona la fecha de fin'
    if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio) {
      e.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio'
    }
    if (!form.numPersonas || Number(form.numPersonas) < 1) {
      e.numPersonas = 'Debe ser al menos 1 persona'
    }
    if (!form.acepto) e.acepto = 'Debes aceptar los términos'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      // POST /api/itinerarios/completo — crea el itinerario de verdad.
      // usuarioId viaja en el body, pero si quien llama no es ADMIN, el
      // backend lo ignora y usa el ID de quien está autenticado (ver
      // ItinerarioService.resolverUsuarioId) — así que esto es seguro
      // incluso si alguien manipulara el valor en el navegador.
      // La API devuelve el Itinerario ya guardado, con id, destino y
      // usuario anidados — es justo lo que necesita Confirmacion.jsx
      // para mostrar datos reales en vez de un mensaje genérico.
      const itinerarioCreado = await itinerarioService.crear({
        usuarioId: user.id,
        destinoId: destinoSeleccionado.id,
        titulo: form.titulo.trim(),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        numPersonas: Number(form.numPersonas),
        presupuestoTotal: form.presupuestoTotal ? Number(form.presupuestoTotal) : null,
        moneda: 'USD',
        // TODO: cuando se integre un modelo de IA real que genere las
        // actividades día a día automáticamente, marcar generadoPorIa=true
        // y poblar el array `actividades` con el resultado de ese modelo.
        // Por ahora el itinerario se guarda en estado "borrador" con las
        // notas del usuario, listo para completarse manualmente.
        generadoPorIa: false,
        notas: form.notas.trim(),
        actividades: [],
      })

      setForm(INITIAL)
      setDestinoSeleccionado(null)
      setUltimoItinerario(itinerarioCreado)
      setFormSubmitted(true)   // activa el StepGuard hacia /confirmacion
      setShowModal(true)
    } catch (err) {
      setApiError(err.message || 'No se pudo crear tu itinerario. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section contact">
      <div className="container">
        {/* Info */}
        <div ref={infoRef} className="reveal contact-info">
          <div className="section-tag">Planifica tu viaje</div>
          <h2>¿Listo para tu<br /><span className="text-gradient">próxima aventura?</span></h2>
          <p>
            Cuéntanos las fechas y el destino, y VoyageAI arma la base de tu
            itinerario en minutos — lo verás guardado en tu panel.
          </p>

          <div className="contact-items">
            {[
              { icon: <FiMail />,    label: 'Email',     val: 'hola@voyageai.com' },
              { icon: <FiPhone />,   label: 'Teléfono',  val: '+1 (555) 000-1234' },
              { icon: <FiMapPin />,  label: 'Oficina',   val: 'San Francisco, CA' },
            ].map(({ icon, label, val }) => (
              <div key={label} className="contact-item">
                <div className="contact-item-icon">{icon}</div>
                <div>
                  <span>{label}</span>
                  <strong>{val}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — cambia según sesión / destino elegido */}
        <div ref={formRef} className="reveal reveal-delay-2">

          {!user ? (
            /* Sin sesión — no se puede crear itinerario sin saber de quién es */
            <div className="contact-form" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Inicia sesión para planificar tu viaje</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Crea una cuenta gratuita o inicia sesión para que VoyageAI
                guarde tu itinerario en tu panel personal.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn btn-outline">Iniciar sesión</Link>
                <Link to="/registro" className="btn btn-primary">Registrarse</Link>
              </div>
            </div>
          ) : !destinoSeleccionado ? (
            /* Con sesión pero sin destino elegido todavía */
            <div className="contact-form" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Elige un destino para empezar</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Elige un destino desde el listado completo, o selecciona
                "Ver ruta" en cualquiera de los destacados de arriba.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/destinos')}
              >
                Ver destinos
              </button>
            </div>
          ) : (
            /* Listo para crear el itinerario */
            <form className="contact-form" onSubmit={handleSubmit} noValidate>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <span style={{
                  display: 'inline-block', padding: '0.35rem 0.75rem',
                  borderRadius: '50px', background: 'rgba(91,79,232,0.12)',
                  color: 'var(--primary-light)', fontSize: '0.8rem', fontWeight: 600,
                }}>
                  📍 {destinoSeleccionado.nombre}
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/destinos')}
                  style={{
                    marginLeft: '0.5rem', fontSize: '0.8rem', background: 'none',
                    border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Elegir otro destino
                </button>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="titulo">Título del viaje *</label>
                <input id="titulo" name="titulo" className={`form-control ${errors.titulo ? 'error' : ''}`}
                  placeholder="Ej. Aventura en Tokio" value={form.titulo} onChange={handleChange} />
                {errors.titulo && <p className="form-error">{errors.titulo}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="fechaInicio">Fecha de inicio *</label>
                  <input id="fechaInicio" name="fechaInicio" type="date" min={HOY}
                    className={`form-control ${errors.fechaInicio ? 'error' : ''}`}
                    value={form.fechaInicio} onChange={handleChange} />
                  {errors.fechaInicio && <p className="form-error">{errors.fechaInicio}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fechaFin">Fecha de fin *</label>
                  <input id="fechaFin" name="fechaFin" type="date" min={form.fechaInicio || HOY}
                    className={`form-control ${errors.fechaFin ? 'error' : ''}`}
                    value={form.fechaFin} onChange={handleChange} />
                  {errors.fechaFin && <p className="form-error">{errors.fechaFin}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="numPersonas">Número de personas *</label>
                  <input id="numPersonas" name="numPersonas" type="number" min="1"
                    className={`form-control ${errors.numPersonas ? 'error' : ''}`}
                    value={form.numPersonas} onChange={handleChange} />
                  {errors.numPersonas && <p className="form-error">{errors.numPersonas}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="presupuestoTotal">Presupuesto aprox. (USD)</label>
                  <input id="presupuestoTotal" name="presupuestoTotal" type="number" min="0"
                    className="form-control" placeholder="Opcional"
                    value={form.presupuestoTotal} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notas">¿Algo que no puede faltar en tu viaje?</label>
                <textarea id="notas" name="notas" className="form-control"
                  placeholder="Cuéntanos tus preferencias: gastronomía, aventura, descanso..."
                  value={form.notas} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-check">
                  <input type="checkbox" name="acepto" checked={form.acepto} onChange={handleChange} />
                  Acepto los <a href="#" style={{ color: 'var(--primary-light)' }}>términos y condiciones</a> y la política de privacidad
                </label>
                {errors.acepto && <p className="form-error" style={{ marginTop: '0.35rem' }}>{errors.acepto}</p>}
              </div>

              {apiError && <p className="form-error" style={{ marginBottom: '1rem' }}>{apiError}</p>}

              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creando itinerario...' : 'Crear mi itinerario'}
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Se guarda como borrador en tu panel
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal con React Portal */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </section>
  )
}