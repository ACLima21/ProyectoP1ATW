import { useState, useEffect, useCallback } from 'react'
import { itinerarioService } from '../services/itinerarioService'
import {
  FiX, FiMapPin, FiCalendar, FiUsers, FiDollarSign,
  FiClock, FiStar, FiAlertCircle, FiZap, FiList,
  FiNavigation, FiCoffee, FiHome, FiTruck
} from 'react-icons/fi'

/* Mapa de colores por estado */
const ESTADO_META = {
  borrador:   { label: 'Borrador',   bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B' },
  activo:     { label: 'Activo',     bg: 'rgba(91,79,232,0.12)',   color: '#818CF8' },
  completado: { label: 'Completado', bg: 'rgba(16,185,129,0.12)',  color: '#10B981' },
  cancelado:  { label: 'Cancelado',  bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
}

/* Ícono por tipo de actividad */
const TIPO_ICON = {
  turismo:    <FiMapPin size={14} />,
  comida:     <FiCoffee size={14} />,
  hospedaje:  <FiHome size={14} />,
  transporte: <FiTruck size={14} />,
}

const ESTADOS_VALIDOS = ['borrador', 'activo', 'completado', 'cancelado']

export default function ItinerarioDetalleModal({ itinerario, onClose, onEstadoChanged }) {
  const [actividades, setActividades]       = useState([])
  const [loadingActs, setLoadingActs]       = useState(true)
  const [resumenIa, setResumenIa]           = useState(itinerario.resumenIa || '')
  const [generandoIa, setGenerandoIa]       = useState(false)
  const [errorIa, setErrorIa]               = useState('')
  const [estado, setEstado]                 = useState(itinerario.estado)
  const [cambiandoEstado, setCambiandoEstado] = useState(false)

  // Cargar actividades al abrir
  useEffect(() => {
    setLoadingActs(true)
    itinerarioService.getActividades(itinerario.id)
      .then(data => setActividades(data))
      .catch(err => console.error('Error cargando actividades:', err))
      .finally(() => setLoadingActs(false))
  }, [itinerario.id])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Agrupar actividades por día
  const actividadesPorDia = actividades.reduce((acc, act) => {
    const dia = act.diaNumero ?? 1
    if (!acc[dia]) acc[dia] = []
    acc[dia].push(act)
    return acc
  }, {})

  const handleGenerarIa = async () => {
    setGenerandoIa(true)
    setErrorIa('')
    try {
      const updated = await itinerarioService.generarResumenIa(itinerario.id)
      setResumenIa(updated.resumenIa || '')
    } catch (err) {
      setErrorIa(err.message || 'No se pudo conectar con el servicio de IA. ¿Está Ollama activo?')
    } finally {
      setGenerandoIa(false)
    }
  }

  const handleCambiarEstado = async (nuevoEstado) => {
    if (nuevoEstado === estado) return
    setCambiandoEstado(true)
    try {
      await itinerarioService.actualizarEstado(itinerario.id, nuevoEstado)
      setEstado(nuevoEstado)
      onEstadoChanged?.(itinerario.id, nuevoEstado)
    } catch (err) {
      console.error('Error cambiando estado:', err)
    } finally {
      setCambiandoEstado(false)
    }
  }

  const estadoMeta = ESTADO_META[estado] || ESTADO_META.borrador

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal panel */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(780px, 95vw)',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: 'var(--card-bg, #1a1a2e)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
        borderRadius: '20px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        zIndex: 1001,
        animation: 'slideUp 0.2s ease',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '1.4rem 1.6rem 1rem',
          borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
          display: 'flex', alignItems: 'flex-start', gap: '1rem',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {itinerario.titulo}
              </h2>
              <span style={{
                background: estadoMeta.bg, color: estadoMeta.color,
                fontSize: '0.72rem', fontWeight: 600,
                padding: '0.2rem 0.6rem', borderRadius: '999px',
                textTransform: 'uppercase', letterSpacing: '0.04em',
                flexShrink: 0,
              }}>
                {estadoMeta.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiMapPin size={13} />
                {itinerario.destino?.nombre || '—'}{itinerario.destino?.pais ? `, ${itinerario.destino.pais}` : ''}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiCalendar size={13} />
                {itinerario.fechaInicio} → {itinerario.fechaFin}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiUsers size={13} />
                {itinerario.numPersonas ?? 1} persona{(itinerario.numPersonas ?? 1) !== 1 ? 's' : ''}
              </span>
              {itinerario.presupuestoTotal && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FiDollarSign size={13} />
                  {Number(itinerario.presupuestoTotal).toLocaleString()} {itinerario.moneda || 'USD'}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', transition: 'background 0.15s',
            flexShrink: 0,
          }}>
            <FiX size={17} />
          </button>
        </div>

        {/* ── Cuerpo con scroll ── */}
        <div style={{ overflow: 'auto', flex: 1, padding: '1.2rem 1.6rem 1.6rem' }}>

          {/* Cambiar Estado */}
          <div style={{ marginBottom: '1.4rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.55rem' }}>
              Estado del viaje
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {ESTADOS_VALIDOS.map(e => {
                const meta = ESTADO_META[e]
                const activo = e === estado
                return (
                  <button
                    key={e}
                    onClick={() => handleCambiarEstado(e)}
                    disabled={cambiandoEstado}
                    style={{
                      background: activo ? meta.bg : 'rgba(255,255,255,0.04)',
                      color: activo ? meta.color : 'var(--text-muted)',
                      border: `1px solid ${activo ? meta.color : 'transparent'}`,
                      borderRadius: '999px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.78rem', fontWeight: activo ? 700 : 400,
                      cursor: cambiandoEstado ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      opacity: cambiandoEstado && !activo ? 0.5 : 1,
                    }}
                  >
                    {meta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Resumen IA */}
          <div style={{
            background: 'rgba(91,79,232,0.06)',
            border: '1px solid rgba(91,79,232,0.18)',
            borderRadius: '12px',
            padding: '1rem 1.15rem',
            marginBottom: '1.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <FiZap size={15} color="#818CF8" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Resumen con IA
              </span>
            </div>

            {resumenIa ? (
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text-primary)' }}>
                {resumenIa}
              </p>
            ) : (
              <p style={{ margin: '0 0 0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Genera un resumen descriptivo de este viaje usando el modelo de IA local (Ollama).
              </p>
            )}

            {errorIa && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.6rem', color: '#EF4444', fontSize: '0.8rem' }}>
                <FiAlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                {errorIa}
              </div>
            )}

            <button
              onClick={handleGenerarIa}
              disabled={generandoIa}
              style={{
                marginTop: resumenIa ? '0.75rem' : 0,
                background: 'rgba(91,79,232,0.18)',
                border: '1px solid rgba(91,79,232,0.3)',
                color: '#818CF8',
                borderRadius: '8px',
                padding: '0.45rem 1rem',
                fontSize: '0.82rem', fontWeight: 600,
                cursor: generandoIa ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                opacity: generandoIa ? 0.7 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {generandoIa
                ? <><span className="auth-spinner" style={{ width: 14, height: 14, borderWidth: 1.5, display: 'inline-block' }} /> Generando...</>
                : <><FiZap size={14} /> {resumenIa ? 'Regenerar resumen' : 'Generar resumen'}</>
              }
            </button>
          </div>

          {/* Cronograma de Actividades */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <FiList size={15} color="var(--primary-light)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Cronograma de actividades
              </span>
            </div>

            {loadingActs ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <span className="auth-spinner" style={{ width: 22, height: 22, borderWidth: 2, display: 'inline-block' }} />
                <p style={{ marginTop: '0.6rem', fontSize: '0.85rem' }}>Cargando actividades...</p>
              </div>
            ) : Object.keys(actividadesPorDia).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem',
                background: 'rgba(255,255,255,0.02)', borderRadius: '10px',
                border: '1px dashed rgba(255,255,255,0.08)',
              }}>
                Este itinerario no tiene actividades registradas.
              </div>
            ) : (
              Object.entries(actividadesPorDia).sort(([a],[b]) => Number(a)-Number(b)).map(([dia, acts]) => (
                <div key={dia} style={{ marginBottom: '1.1rem' }}>
                  {/* Label del día */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      D{dia}
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Día {dia}
                    </span>
                  </div>

                  {/* Actividades del día */}
                  <div style={{ paddingLeft: '2rem', borderLeft: '2px solid rgba(91,79,232,0.2)' }}>
                    {acts.map((act, idx) => (
                      <div key={act.id ?? idx} style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        padding: '0.7rem 0.9rem',
                        marginBottom: '0.5rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{act.titulo}</span>
                          {act.tipo && (
                            <span style={{
                              display: 'flex', alignItems: 'center', gap: '0.25rem',
                              fontSize: '0.7rem', color: 'var(--text-muted)',
                              background: 'rgba(255,255,255,0.04)', borderRadius: '999px',
                              padding: '0.15rem 0.55rem',
                            }}>
                              {TIPO_ICON[act.tipo] ?? <FiStar size={12} />} {act.tipo}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.77rem', color: 'var(--text-muted)', marginBottom: act.descripcion ? '0.35rem' : 0 }}>
                          {(act.horaInicio || act.horaFin) && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FiClock size={11} />
                              {act.horaInicio}{act.horaFin ? ` → ${act.horaFin}` : ''}
                            </span>
                          )}
                          {act.lugar && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FiNavigation size={11} /> {act.lugar}
                            </span>
                          )}
                          {act.costoEstimado && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FiDollarSign size={11} />
                              {Number(act.costoEstimado).toLocaleString()} {act.moneda || 'USD'}
                            </span>
                          )}
                        </div>
                        {act.descripcion && (
                          <p style={{ margin: 0, fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                            {act.descripcion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  )
}
