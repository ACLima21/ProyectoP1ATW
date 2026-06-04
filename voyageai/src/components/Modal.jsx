import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiSmile } from 'react-icons/fi'

// Modal usando React Portal — se renderiza fuera del árbol DOM principal
export default function Modal({ onClose }) {
  const navigate = useNavigate()

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleNavegar = () => {
    onClose()
    navigate('/confirmacion')   // ← navega a la ruta protegida
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="modal-icon"><FiSmile style={{ color: '#10B981' }} /></div>
        <h3>¡Mensaje enviado!</h3>
        <p>
          Hemos recibido tu consulta. Haz clic para ver
          la confirmación completa de tu solicitud.
        </p>
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleNavegar}
        >
          Ver mi confirmación <FiArrowRight />
        </button>
      </div>
    </div>,
    document.body
  )
}