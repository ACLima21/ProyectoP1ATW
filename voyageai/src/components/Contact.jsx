import { useState, useCallback } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Modal from './Modal'
import { useFlow } from '../context/FlowContext'

const INITIAL = { nombre: '', apellido: '', email: '', interes: '', mensaje: '', acepto: false }

export default function Contact() {
  const [form,       setForm]       = useState(INITIAL)
  const [errors,     setErrors]     = useState({})
  const [loading,    setLoading]    = useState(false)
  const [showModal,  setShowModal]  = useState(false)
  const { setFormSubmitted } = useFlow()
  const infoRef = useScrollReveal()
  const formRef = useScrollReveal()

  // Manejar cambios — componentes controlados
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  // Validación
  const validate = () => {
    const e = {}
    if (!form.nombre.trim())               e.nombre   = 'El nombre es requerido'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email inválido'
    if (!form.mensaje.trim())              e.mensaje  = 'Escribe tu mensaje'
    if (!form.acepto)                      e.acepto   = 'Debes aceptar los términos'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    // Simular petición asíncrona
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setForm(INITIAL)
    setFormSubmitted(true)   // ← nueva línea: activa el guard
    setShowModal(true)
  }

  return (
    <section className="section contact">
      <div className="container">
        {/* Info */}
        <div ref={infoRef} className="reveal contact-info">
          <div className="section-tag">Contacto</div>
          <h2>¿Listo para tu<br /><span className="text-gradient">próxima aventura?</span></h2>
          <p>
            Escríbenos y un asesor de viajes con IA te ayudará a planificar
            el viaje de tus sueños en menos de 24 horas.
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

        {/* Formulario controlado */}
        <div ref={formRef} className="reveal reveal-delay-2">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre *</label>
                <input id="nombre" name="nombre" className={`form-control ${errors.nombre ? 'error' : ''}`}
                  placeholder="Tu nombre" value={form.nombre} onChange={handleChange} />
                {errors.nombre && <p className="form-error">{errors.nombre}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="apellido">Apellido</label>
                <input id="apellido" name="apellido" className="form-control"
                  placeholder="Tu apellido" value={form.apellido} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="tuemail@ejemplo.com" value={form.email} onChange={handleChange} />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Select — uso de <select> como componente controlado */}
            <div className="form-group">
              <label className="form-label" htmlFor="interes">¿Qué te interesa?</label>
              <select id="interes" name="interes" className="form-control" value={form.interes} onChange={handleChange}>
                <option value="">Selecciona una opción</option>
                <option value="itinerario">Crear un itinerario</option>
                <option value="precio">Consultar precios</option>
                <option value="empresa">Solución para empresas</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mensaje">Mensaje *</label>
              <textarea id="mensaje" name="mensaje" className={`form-control ${errors.mensaje ? 'error' : ''}`}
                placeholder="Cuéntanos sobre tu viaje soñado..." value={form.mensaje} onChange={handleChange} />
              {errors.mensaje && <p className="form-error">{errors.mensaje}</p>}
            </div>

            {/* Checkbox */}
            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" name="acepto" checked={form.acepto} onChange={handleChange} />
                Acepto los <a href="#" style={{ color: 'var(--primary-light)' }}>términos y condiciones</a> y la política de privacidad
              </label>
              {errors.acepto && <p className="form-error" style={{ marginTop: '0.35rem' }}>{errors.acepto}</p>}
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Enviando...' : '✉️ Enviar mensaje'}
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Respuesta en &lt; 24 horas
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Modal con React Portal */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </section>
  )
}