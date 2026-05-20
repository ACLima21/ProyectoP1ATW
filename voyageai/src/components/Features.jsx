import { useScrollReveal } from '../hooks/useScrollReveal'

const FEATURES = [
  { icon: '🤖', color: '#5B4FE8', bg: 'rgba(91,79,232,0.15)',  title: 'IA Personalizada',    desc: 'Algoritmos que aprenden tus gustos y preferencias para crear itinerarios únicos cada vez.' },
  { icon: '🗺️', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', title: 'Mapas Interactivos',  desc: 'Visualiza tu ruta en mapas detallados con puntos de interés, restaurantes y actividades.' },
  { icon: '💰', color: '#10B981', bg: 'rgba(16,185,129,0.15)', title: 'Control de Presupuesto', desc: 'Optimiza cada gasto. Compara precios en tiempo real y encuentra las mejores ofertas.' },
  { icon: '🌐', color: '#EC4899', bg: 'rgba(236,72,153,0.15)', title: 'Multi-idioma',          desc: 'Traducciones instantáneas, guías culturales y frases útiles para cada destino.' },
  { icon: '📅', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)',  title: 'Calendario Inteligente', desc: 'Sincroniza tu itinerario con Google Calendar y recibe recordatorios automáticos.' },
  { icon: '🔒', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', title: 'Viaje Seguro',          desc: 'Alertas de seguridad, seguros de viaje recomendados y contactos de emergencia.' },
]

export default function Features() {
  const headerRef = useScrollReveal()

  return (
    <section className="section" style={{ background: 'rgba(91,79,232,0.03)' }}>
      <div className="container">
        <div ref={headerRef} className="reveal features-header">
          <div className="section-tag">Características</div>
          <h2 className="section-title">Todo lo que necesitas para<br /><span className="text-gradient">viajar mejor</span></h2>
          <p className="section-subtitle mx-auto">
            Herramientas diseñadas para que te enfoques en disfrutar,
            mientras la IA se encarga del resto.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const ref = useScrollReveal()
            return (
              <div
                key={f.title}
                ref={ref}
                className={`feature-card reveal reveal-delay-${(i % 4) + 1}`}
              >
                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}