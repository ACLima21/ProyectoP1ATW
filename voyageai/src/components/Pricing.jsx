import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiCheck, FiX } from 'react-icons/fi'
import Tooltip from './Tooltip'

const PLANES = [
  {
    name: 'Explorador',
    monthlyPrice: 0,
    annualPrice: 0,
    desc: 'Perfecto para empezar a explorar el mundo.',
    features: [
      { text: '3 itinerarios / mes',   ok: true },
      { text: 'Destinos básicos',       ok: true },
      { text: 'Mapas interactivos',     ok: true },
      { text: 'IA avanzada',            ok: false },
      { text: 'Soporte prioritario',    ok: false },
    ],
    cta: 'Gratis para siempre',
  },
  {
    name: 'Viajero',
    monthlyPrice: 12,
    annualPrice: 8,
    desc: 'Para viajeros frecuentes que quieren más.',
    features: [
      { text: 'Itinerarios ilimitados', ok: true },
      { text: 'Todos los destinos',     ok: true },
      { text: 'Mapas interactivos',     ok: true },
      { text: 'IA avanzada',            ok: true },
      { text: 'Soporte prioritario',    ok: false },
    ],
    featured: true,
    cta: 'Empezar ahora',
  },
  {
    name: 'Nómada Pro',
    monthlyPrice: 29,
    annualPrice: 19,
    desc: 'Máximo poder para los grandes exploradores.',
    features: [
      { text: 'Todo en Viajero',        ok: true },
      { text: 'API access',             ok: true },
      { text: 'Informes de viaje',      ok: true },
      { text: 'IA avanzada',            ok: true },
      { text: 'Soporte 24/7',           ok: true },
    ],
    cta: 'Contactar ventas',
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const headerRef = useScrollReveal()

  return (
    <section className="section" style={{ background: 'rgba(91,79,232,0.03)' }}>
      <div className="container">
        <div ref={headerRef} className="reveal pricing-header">
          <div className="section-tag">Precios</div>
          <h2 className="section-title">Planes para cada<br /><span className="text-gradient">tipo de viajero</span></h2>
          <p className="section-subtitle mx-auto">Sin sorpresas. Sin comisiones ocultas.</p>

          {/* Toggle mensual / anual — useState */}
          <div className="pricing-toggle" style={{ marginTop: '1.5rem' }}>
            <button className={`toggle-option ${!annual ? 'active' : ''}`} onClick={() => setAnnual(false)}>
              Mensual
            </button>
            <button className={`toggle-option ${annual ? 'active' : ''}`} onClick={() => setAnnual(true)}>
              Anual
              <Tooltip text="Ahorra hasta un 35%">
                <span style={{
                  marginLeft: '6px',
                  background: 'rgba(16,185,129,0.2)',
                  color: '#10B981',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '50px',
                  fontWeight: 700,
                }}>-35%</span>
              </Tooltip>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {PLANES.map((p) => {
            const price = annual ? p.annualPrice : p.monthlyPrice
            return (
              <div key={p.name} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  <sup>$</sup>
                  {price}
                  {price > 0 && <span>/mes</span>}
                </div>
                <p className="plan-desc">{p.desc}</p>
                <ul className="plan-features">
                  {p.features.map((f) => (
                    <li key={f.text} className="plan-feature">
                      {f.ok
                        ? <FiCheck className="check" />
                        : <FiX className="cross" style={{ color: 'var(--text-muted)' }} />
                      }
                      <span style={{ color: f.ok ? 'var(--text)' : 'var(--text-muted)' }}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  {p.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}