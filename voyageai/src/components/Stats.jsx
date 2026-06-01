import { useCounter } from '../hooks/useCounter'
import statsData from '../data/stats.json'

function StatItem({ counterTarget, suffix, label, prefix }) {
  const { count, ref } = useCounter(counterTarget, 2200)

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
          {statsData.map((s) => <StatItem key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  )
}