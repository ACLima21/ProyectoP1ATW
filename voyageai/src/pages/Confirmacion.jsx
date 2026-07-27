import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlow } from '../context/FlowContext'
import { itinerarioService } from '../services/itinerarioService'
import {
  FiArrowLeft, FiArrowRight, FiCheckCircle, FiCalendar,
  FiUsers, FiCompass, FiMapPin, FiDollarSign,
} from 'react-icons/fi'

// Formatea 'YYYY-MM-DD' a algo legible en español.
// Se agrega T00:00:00 para que el navegador lo interprete en hora local
// y no se corra un día por la conversión a UTC.
function formatFecha(fecha) {
  if (!fecha) return ''
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Confirmacion() {
  const navigate = useNavigate()
  const { setFormSubmitted, ultimoItinerario, setUltimoItinerario } = useFlow()

  // Resumen generado por IA (Ollama) — se pide en un segundo paso, después
  // de que el itinerario ya quedó creado, para no retrasar esa petición.
  const [resumenIa,        setResumenIa]        = useState(ultimoItinerario?.resumenIa ?? null)
  const [generandoResumen, setGenerandoResumen]  = useState(false)
  const [errorResumen,     setErrorResumen]      = useState('')

  useEffect(() => {
    // Si no hay itinerario en memoria (ej. se recargó la página) o ya
    // tenemos el resumen, no hay nada que pedir.
    if (!ultimoItinerario || resumenIa) return

    let cancelado = false
    setGenerandoResumen(true)
    setErrorResumen('')

    itinerarioService.generarResumenIa(ultimoItinerario.id)
      .then(actualizado => {
        if (!cancelado) setResumenIa(actualizado.resumenIa)
      })
      .catch(err => {
        if (!cancelado) {
          setErrorResumen(err.message || 'No se pudo generar el resumen con IA. Puedes verlo más tarde en tu panel.')
        }
      })
      .finally(() => {
        if (!cancelado) setGenerandoResumen(false)
      })

    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ultimoItinerario])

  const handleVolver = () => {
    // Resetea el estado para que el guard vuelva a funcionar
    setFormSubmitted(false)
    setUltimoItinerario(null)
    navigate('/')
  }

  const handleIrDashboard = () => {
    setFormSubmitted(false)
    setUltimoItinerario(null)
    navigate('/dashboard')
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
            {ultimoItinerario ? 'Itinerario creado' : 'Solicitud recibida'}
          </div>

          {ultimoItinerario ? (
            <>
              {/* ── Caso real: tenemos el itinerario recién creado ── */}
              <h1 className="confirmacion-title">
                ¡Tu viaje a<br />
                <span className="text-gradient">{ultimoItinerario.destino?.nombre}</span> está en marcha!
              </h1>

              <p className="confirmacion-desc">
                Guardamos <strong>{ultimoItinerario.titulo}</strong> como borrador
                en tu panel. Puedes editarlo o completarlo cuando quieras.
              </p>

              {/* Resumen con los datos reales del itinerario */}
              <div className="confirmacion-steps">
                <div className="confirmacion-step">
                  <div className="step-icon" style={{ background: 'rgba(91,79,232,0.15)', color: 'var(--primary-light)' }}>
                    <FiMapPin />
                  </div>
                  <div>
                    <strong>{ultimoItinerario.destino?.nombre}</strong>
                    <span>Destino elegido</span>
                  </div>
                </div>

                <div className="confirmacion-step">
                  <div className="step-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                    <FiCalendar />
                  </div>
                  <div>
                    <strong>
                      {formatFecha(ultimoItinerario.fechaInicio)} → {formatFecha(ultimoItinerario.fechaFin)}
                    </strong>
                    <span>Fechas del viaje</span>
                  </div>
                </div>

                <div className="confirmacion-step">
                  <div className="step-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                    <FiUsers />
                  </div>
                  <div>
                    <strong>
                      {ultimoItinerario.numPersonas} persona{ultimoItinerario.numPersonas !== 1 ? 's' : ''}
                    </strong>
                    <span>Viajeros</span>
                  </div>
                </div>

                {ultimoItinerario.presupuestoTotal && (
                  <div className="confirmacion-step">
                    <div className="step-icon" style={{ background: 'rgba(129,140,248,0.15)', color: '#818CF8' }}>
                      <FiDollarSign />
                    </div>
                    <div>
                      <strong>
                        ${Number(ultimoItinerario.presupuestoTotal).toLocaleString()} {ultimoItinerario.moneda}
                      </strong>
                      <span>Presupuesto aproximado</span>
                    </div>
                  </div>
                )}
              </div>

              {ultimoItinerario.notas && (
                <p style={{
                  fontSize: '0.85rem', color: 'var(--text-muted)',
                  marginTop: '1.25rem', fontStyle: 'italic',
                }}>
                  "{ultimoItinerario.notas}"
                </p>
              )}

              {/* Resumen generado por IA (Ollama) */}
              <div style={{
                marginTop: '1.5rem', padding: '1.25rem', borderRadius: '12px',
                background: 'rgba(91,79,232,0.06)', textAlign: 'left',
              }}>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 700,
                  color: 'var(--primary-light)', marginBottom: '0.5rem',
                  letterSpacing: '0.02em',
                }}>
                  ✨ RESUMEN GENERADO POR IA
                </div>

                {generandoResumen && (
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                    <span className="auth-spinner" style={{
                      width: 16, height: 16, borderWidth: 2, display: 'inline-block',
                      marginRight: '0.5rem', verticalAlign: 'middle',
                    }} />
                    Generando tu resumen personalizado...
                  </p>
                )}

                {!generandoResumen && errorResumen && (
                  <p style={{ color: 'var(--danger)', margin: 0, fontSize: '0.85rem' }}>
                    {errorResumen}
                  </p>
                )}

                {!generandoResumen && !errorResumen && resumenIa && (
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{resumenIa}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* ── Fallback: no hay datos en memoria (ej. se recargó la página) ── */}
              <h1 className="confirmacion-title">
                ¡Gracias por<br />
                <span className="text-gradient">tu solicitud!</span>
              </h1>

              <p className="confirmacion-desc">
                Tu itinerario ya está guardado, pero no encontramos sus
                detalles en esta sesión (por ejemplo, si recargaste la
                página). Puedes verlo completo en tu panel.
              </p>
            </>
          )}

          <div style={{
            display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
            justifyContent: 'center', marginTop: '1.75rem',
          }}>
            {ultimoItinerario && (
              <button className="btn btn-primary" onClick={handleIrDashboard}>
                Ver en mi panel <FiArrowRight />
              </button>
            )}
            <button className="btn btn-outline" onClick={handleVolver}>
              <FiArrowLeft /> Volver al inicio
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}