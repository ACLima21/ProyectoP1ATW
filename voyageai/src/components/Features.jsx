import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiCpu, FiMap, FiDollarSign, FiGlobe, FiCalendar, FiShield } from 'react-icons/fi'
import featuresData from '../data/features.json'

/*
 * Mapa de claves -> componentes de íconos.
 * Si en el futuro se cambia el set de íconos, solo se actualiza este mapa sin tocar el resto del código. 
*/

const ICON_MAP = {
  cpu: FiCpu,
  map: FiMap,
  dollarSign: FiDollarSign,
  globe: FiGlobe,
  calendar: FiCalendar,
  shield: FiShield
}

function FeatureCard({ iconKey, color, bg, title, desc, delay }) {
  const ref = useScrollReveal()
  const Icon = ICON_MAP[iconKey]

  return (
    <div ref={ref} className={`feature-card reveal reveal-delay-${delay}`}>
      <div className="feature-icon" style={{ background: bg, color }}>
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

export default function Features() {
  const headerRef = useScrollReveal()

  return (
    <section className="section" style={{ background: 'rgba(91,79,232,0.03)'}}>
      <div className="container">
        <div ref={headerRef} className="reveal features-header">
          <div className="section-tag">Características</div>
          <h2 className="section-title">
            Todo lo que necesitas para <br />
            <span className="text-gradient">viajar mejor</span><br />
          </h2>
          <p className="section-subtitle mx-auto">
            Herramientas diseñadas para que te enfoques en disfrutar, mientras la IA se encarga del resto.
          </p>
        </div>

        <div className="features-grid">
          {featuresData.map((f, i) => (
            <FeatureCard 
              key={f.id}
              {...f}
              delay={(i % 4) + 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}