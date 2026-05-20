import { createPortal } from 'react-dom'
import { useEffect } from 'react'

// Modal usando React Portal — se renderiza fuera del árbol DOM principal
export default function Modal({ onClose }) {
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

  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="modal-icon">✅</div>
        <h3>¡Mensaje enviado!</h3>
        <p>
          Gracias por contactarnos. Nuestro equipo revisará tu mensaje
          y te responderá en menos de 24 horas.
        </p>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Perfecto, cerrar
        </button>
      </div>
    </div>,
    document.body
  )
}