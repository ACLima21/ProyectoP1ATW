import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiCheck, FiX } from 'react-icons/fi'
import Tooltip from './Tooltip'
import pricingData from '../data/planes.json'

// Desestructura la configuración global y los planes por separado
const { annualDiscount, plans } = pricingData

// Calcula el precio anual de un plan a partir del descuento del JSON
// Ej: monthlyPrice=12, annualDiscount=35 → Math.round(12 * 0.65) = 8
function calcAnnualPrice(monthlyPrice) {
  return Math.round(monthlyPrice * (1 - annualDiscount / 100))
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const headerRef = useScrollReveal()

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

          {/* Toggle — el label del badge usa annualDiscount del JSON */}
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
              <Tooltip text={`Ahorra hasta un ${annualDiscount}%`}>
                <span style={{
                  marginLeft: '6px',
                  background: 'rgba(16,185,129,0.2)',
                  color: '#10B981',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '50px',
                  fontWeight: 700,
                }}>
                  -{annualDiscount}%
                </span>
              </Tooltip>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((p) => {
            // Precio calculado en tiempo de render, no leído del JSON
            const price = annual ? calcAnnualPrice(p.monthlyPrice) : p.monthlyPrice

            return (
              <div key={p.id} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
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
                        : <FiX style={{ color: 'var(--text-muted)' }} />
                      }
                      <span style={{ color: f.ok ? 'var(--text)' : 'var(--text-muted)' }}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
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