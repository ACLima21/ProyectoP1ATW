import { useCounter } from '../hooks/useCounter'

const DATA = [
  { target: 200000, suffix: 'K+', label: 'Viajeros activos',   prefix: '' },
  { target: 150,    suffix: '+',  label: 'Destinos cubiertos', prefix: '' },
  { target: 98,     suffix: '%',  label: 'Satisfacción',       prefix: '' },
  { target: 4,      suffix: 'M+', label: 'Itinerarios creados', prefix: '' },
]

function StatItem({ target, suffix, label, prefix }) {
  // Ajusta el número para la visualización (200000 → 200)
  const displayTarget = suffix === 'K+' ? Math.floor(target / 1000) : target
  const { count, ref } = useCounter(displayTarget, 2200)

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-number">
        {prefix}{count}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="section stats">
      <div className="container">
        <div className="stats-grid">
          {DATA.map((d) => <StatItem key={d.label} {...d} />)}
        </div>
      </div>
    </section>
  )
}