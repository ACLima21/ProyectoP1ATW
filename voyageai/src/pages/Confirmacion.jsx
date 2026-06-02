import { useNavigate } from 'react-router-dom'
import { useFlow } from '../context/FlowContext'
import { FiArrowLeft, FiCheckCircle, FiCalendar, FiMail, FiCompass } from 'react-icons/fi'

export default function Confirmacion() {
  const navigate     = useNavigate()
  const { setFormSubmitted } = useFlow()

  const handleVolver = () => {
    // Resetea el estado para que el guard vuelva a funcionar
    setFormSubmitted(false)
    navigate('/')
  }

  return (
    <div className="confirmacion-page">

      {/* Header mínimo */}
      <header className="confirmacion-header">
        <div className="nav-logo">
          <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Voyage<span>AI</span>
        </div>
      </header>

      {/* Contenido central */}
      <main className="confirmacion-main">
        <div className="confirmacion-card">

          {/* Ícono animado */}
          <div className="confirmacion-icon">
            <FiCheckCircle />
          </div>

          <div className="section-tag" style={{ marginBottom: '1rem' }}>
            Mensaje recibido
          </div>

          <h1 className="confirmacion-title">
            ¡Gracias por<br />
            <span className="text-gradient">contactarnos!</span>
          </h1>

          <p className="confirmacion-desc">
            Hemos recibido tu mensaje correctamente. Un asesor de
            VoyageAI revisará tu consulta y se pondrá en contacto
            contigo pronto.
          </p>

          {/* Pasos siguientes */}
          <div className="confirmacion-steps">
            <div className="confirmacion-step">
              <div className="step-icon" style={{ background: 'rgba(91,79,232,0.15)', color: 'var(--primary-light)' }}>
                <FiMail />
              </div>
              <div>
                <strong>Revisa tu email</strong>
                <span>Te enviamos una copia de tu mensaje</span>
              </div>
            </div>
            <div className="confirmacion-step">
              <div className="step-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <FiCalendar />
              </div>
              <div>
                <strong>Respuesta en 24h</strong>
                <span>Nuestro equipo te contactará pronto</span>
              </div>
            </div>
          </div>

          <button className="btn btn-outline" onClick={handleVolver}>
            <FiArrowLeft /> Volver al inicio
          </button>

        </div>
      </main>
    </div>
  )
}