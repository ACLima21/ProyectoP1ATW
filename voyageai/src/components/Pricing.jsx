import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiCheck, FiX } from 'react-icons/fi'
import Tooltip from './Tooltip'
import { planService } from '../services/planService.js'
import { usuarioService } from '../services/usuarioService.js'
import { useAuth } from '../context/AuthContext'
import planesFallback from '../data/planes.json'

/*
 * PROBLEMA RESUELTO:
 * La columna precio_anual está en 0 en PostgreSQL porque los INSERT
 * originales no la llenaron. La calculamos siempre desde precioMensual
 * y descuentoAnual para que el toggle Mensual / Anual funcione correctamente.
 *
 * Antes: precioAnual venía del JSON como valor hardcodeado (ej. 8)
 * Ahora: se calcula → Math.round(precioMensual * (1 - descuento / 100))
 */

// ── Features estáticas por slot según el índice del plan ──────────────
// Vienen del JSON local porque no están en la BD de negocio
import planesFeaturesData from '../data/planes.json'

function getFeaturesForPlan(planIndex) {
  const raw = planesFeaturesData?.plans ?? planesFeaturesData ?? []
  const plan = Array.isArray(raw) ? raw[planIndex] : null
  return plan?.features ?? []
}

// ── Normalización robusta — acepta tanto la API como el JSON fallback ──
function normalizePlan(item, index) {
  const precioMensual  = Number(item?.precioMensual  ?? item?.monthlyPrice  ?? 0)
  const descuentoAnual = Number(item?.descuentoAnual ?? item?.annualDiscount ?? 0)

  /*
   * precioAnual en la BD puede ser 0 si no fue insertado.
   * Lo calculamos siempre desde el descuento para que el toggle
   * Mensual/Anual muestre valores correctos.
   * Si el plan es gratuito (precioMensual = 0), el precio anual también es 0.
   */
  const precioAnual = precioMensual === 0
    ? 0
    : Math.round(precioMensual * (1 - descuentoAnual / 100))

  // maxItinerarios: -1 en la BD significa ilimitado
  const maxItinerariosRaw = item?.maxItinerarios ?? 3
  const maxItinerarios    = Number(maxItinerariosRaw)

  return {
    id:              item?.id              ?? index + 1,
    nombre:          item?.nombre          ?? item?.name        ?? 'Plan',
    precioMensual,
    precioAnual,
    descuentoAnual,
    maxItinerarios,
    descripcion:     item?.descripcion     ?? item?.desc        ?? '',
    destacado:       Boolean(item?.destacado ?? item?.featured  ?? false),
    cta:             item?.cta             ?? null,
    // Features de presentación — del JSON local (no están en la BD)
    features:        item?.features        ?? getFeaturesForPlan(index),
  }
}

// ── Acepta cualquier forma de respuesta ───────────────────────────────
function getPlanesList(rawResponse) {
  if (Array.isArray(rawResponse))               return rawResponse.map(normalizePlan)
  if (Array.isArray(rawResponse?.content))      return rawResponse.content.map(normalizePlan)
  if (Array.isArray(rawResponse?.plans))        return rawResponse.plans.map(normalizePlan)
  if (Array.isArray(rawResponse?.planes))       return rawResponse.planes.map(normalizePlan)
  if (Array.isArray(rawResponse?.data))         return rawResponse.data.map(normalizePlan)
  return []
}

// ── Texto del botón CTA ───────────────────────────────────────────────
function ctaTexto(plan) {
  if (plan.cta) return plan.cta
  if (plan.precioMensual === 0) return 'Gratis para siempre'
  if (plan.precioMensual > 20)  return 'Contactar ventas'
  return 'Empezar ahora'
}

export default function Pricing() {
  const [planes,   setPlanes]   = useState([])
  const [discount, setDiscount] = useState(35)
  const [annual,   setAnnual]   = useState(false)
  const [error,    setError]    = useState(false)
  const headerRef = useScrollReveal()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Estado del flujo de "elegir plan" — simulado, sin pasarela de pago real
  const [planEnProceso, setPlanEnProceso] = useState(null) // id del plan que se está enviando
  const [planAsignado,  setPlanAsignado]  = useState(null) // id del plan recién asignado (feedback temporal)
  const [errorPlan,     setErrorPlan]     = useState('')

  useEffect(() => {
    const fallbackPlanes = getPlanesList(planesFallback)

    planService.getTodos()
      .then(lista => {
        const normalized = getPlanesList(lista)
        const planesToShow = normalized.length ? normalized : fallbackPlanes
        setPlanes(planesToShow)

        // Descuento máximo para el badge del toggle Anual
        const maxDesc = Math.max(...planesToShow.map(p => p.descuentoAnual || 0), 0)
        if (maxDesc > 0) setDiscount(maxDesc)
      })
      .catch(err => {
        console.warn('API no disponible, usando fallback JSON:', err.message)
        setPlanes(fallbackPlanes)
        setError(true)
      })
  }, [])

  // Click en el botón de un plan.
  // - Sin sesión: manda a Registro (no tiene sentido pedir login para un
  //   plan "gratis", pero así el usuario ya queda con cuenta creada).
  // - Con sesión: asigna el plan de verdad (simulado, sin pago) vía la API.
  const handleElegirPlan = async (plan) => {
    if (!user) {
      navigate('/registro')
      return
    }

    setErrorPlan('')
    setPlanEnProceso(plan.id)
    try {
      await usuarioService.asignarPlan(plan.id)
      setPlanAsignado(plan.id)
      setTimeout(() => setPlanAsignado(null), 3000)
    } catch (err) {
      setErrorPlan(err.message || 'No se pudo asignar el plan. Intenta de nuevo.')
    } finally {
      setPlanEnProceso(null)
    }
  }

  return (
    <section className="section" style={{ background: 'rgba(91,79,232,0.03)' }}>
      <div className="container">

        <div ref={headerRef} className="reveal pricing-header">
          <div className="section-tag">Precios</div>
          <h2 className="section-title">
            Planes para cada<br />
            <span className="text-gradient">tipo de viajero</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Sin sorpresas. Sin comisiones ocultas.
          </p>

          {/* Toggle mensual / anual */}
          <div className="pricing-toggle" style={{ marginTop: '1.5rem' }}>
            <button
              className={`toggle-option ${!annual ? 'active' : ''}`}
              onClick={() => setAnnual(false)}
            >
              Mensual
            </button>
            <button
              className={`toggle-option ${annual ? 'active' : ''}`}
              onClick={() => setAnnual(true)}
            >
              Anual
              <Tooltip text={`Ahorra hasta un ${discount}%`}>
                <span style={{
                  marginLeft: '6px',
                  background: 'rgba(16,185,129,0.2)',
                  color: '#10B981',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '50px',
                  fontWeight: 700,
                }}>
                  -{discount}%
                </span>
              </Tooltip>
            </button>
          </div>
        </div>

        {/* Estado vacío */}
        {planes.length === 0 && (
          <div style={{
            textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0',
          }}>
            <span className="auth-spinner"
              style={{ width: 24, height: 24, borderWidth: 2, display: 'inline-block' }} />
            <p style={{ marginTop: '0.75rem' }}>Cargando planes...</p>
          </div>
        )}

        {/* Grid de planes */}
        {planes.length > 0 && (
          <div className="pricing-grid" style={{ marginTop: '2.5rem' }}>
            {planes.map((p) => {
              /*
               * Precio que se muestra — cambia según el toggle
               * Antes (JSON): venía hardcodeado como annualPrice
               * Ahora (API):  se calcula desde precioMensual × (1 - descuento%)
               */
              const price = annual ? p.precioAnual : p.precioMensual
              const estaProcesando = planEnProceso === p.id
              const fueAsignado    = planAsignado === p.id

              return (
                <div key={p.id}
                  className={`pricing-card ${p.destacado ? 'featured' : ''}`}>

                  <div className="plan-name">{p.nombre}</div>

                  {/* Precio calculado dinámicamente */}
                  <div className="plan-price">
                    <sup>$</sup>
                    {price}
                    {price > 0 && <span>/mes</span>}
                  </div>

                  <p className="plan-desc">{p.descripcion}</p>

                  {/* Features — combinación de lo que tiene la API + JSON local */}
                  <ul className="plan-features">
                    {p.features && p.features.length > 0 ? (
                      p.features.map((f, fi) => (
                        <li key={fi} className="plan-feature">
                          {(f.ok ?? f.disponible ?? true)
                            ? <FiCheck className="check" />
                            : <FiX style={{ color: 'var(--text-muted)' }} />
                          }
                          <span style={{
                            color: (f.ok ?? f.disponible ?? true)
                              ? 'var(--text)'
                              : 'var(--text-muted)',
                          }}>
                            {f.text ?? f.texto ?? ''}
                          </span>
                        </li>
                      ))
                    ) : (
                      /* Si no hay features, muestra solo el límite de itinerarios */
                      <li className="plan-feature">
                        <FiCheck className="check" />
                        <span>
                          {p.maxItinerarios === -1 || p.maxItinerarios === 0
                            ? 'Itinerarios ilimitados'
                            : `${p.maxItinerarios} itinerario${p.maxItinerarios !== 1 ? 's' : ''} / mes`
                          }
                        </span>
                      </li>
                    )}
                  </ul>

                  <button
                    className={`btn ${p.destacado ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => handleElegirPlan(p)}
                    disabled={estaProcesando}
                  >
                    {estaProcesando
                      ? 'Procesando...'
                      : fueAsignado
                        ? '✓ Plan activado'
                        : ctaTexto(p)}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {errorPlan && (
          <p style={{
            textAlign: 'center', color: 'var(--danger)',
            marginTop: '1.5rem', fontSize: '0.9rem',
          }}>
            {errorPlan}
          </p>
        )}

      </div>
    </section>
  )
}