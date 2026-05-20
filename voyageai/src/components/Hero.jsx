import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiArrowRight, FiPlay } from 'react-icons/fi'
import { useState } from 'react'
import japanImg from '../assets/japan.jpg'
import demoVideo from '../assets/demo.mp4'

export default function Hero() {
  const refLeft  = useScrollReveal()
  const refRight = useScrollReveal()
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid-bg" />

      <div className="container">
        {/* Lado izquierdo */}
        <div ref={refLeft} className="reveal">
          <div className="hero-badge">
            ✦ IA para viajeros modernos
          </div>

          <h1 className="hero-title">
            Planifica tu<br />
            <span className="text-gradient">aventura perfecta</span><br />
            con IA
          </h1>

          <p className="hero-desc">
            VoyageAI analiza millones de rutas, hoteles y experiencias
            para crear itinerarios únicos adaptados a tu estilo de viaje
            y presupuesto.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}>
              Comenzar ahora <FiArrowRight />
            </button>
            <button className="btn btn-outline" onClick={() => setVideoOpen(true)}>
              <FiPlay /> Ver demo
            </button>
          </div>

          <div className="hero-stats">
            {[
              { val: '200K+', label: 'Viajeros activos' },
              { val: '98%',   label: 'Satisfacción' },
              { val: '150+',  label: 'Destinos' },
            ].map(({ val, label }) => (
              <div key={label} className="hero-stat">
                <strong>{val}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado derecho — Tarjeta visual */}
        <div ref={refRight} className="reveal reveal-delay-2 hero-visual" style={{ position: 'relative' }}>
          <div className="hero-card-main">
            <div className="hero-card-img" style={{ position: 'relative' }}>
                <img src={japanImg} alt="Itinerario Japón" style={{
                    width: '100%', height: '100%', objectFit: 'cover'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(13,13,26,0.35)'
                }} />
            </div>
            <div className="hero-card-body">
              <h3>Itinerario: Japón 10 días</h3>
              <p>Generado por IA · Basado en tus preferencias</p>
            </div>
          </div>

          {/* Tarjetas flotantes */}
          <div className="hero-floating hero-floating-1">
            <div className="icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>⭐</div>
            <div>
              <strong>4.9 / 5.0</strong>
              <span>Valoración media</span>
            </div>
          </div>

          <div className="hero-floating hero-floating-2">
            <div className="icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>✈️</div>
            <div>
              <strong>Vuelo encontrado</strong>
              <span>Desde $620 USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de video */}
      {videoOpen && (
        <div className="modal-overlay" onClick={() => setVideoOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <button className="modal-close" onClick={() => setVideoOpen(false)}>✕</button>
            <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                <video
                    src={demoVideo}
                    controls
                    autoPlay
                    style={{ width: '100%', display: 'block' }}
                />
            </div>
            <p style={{ marginTop: '1rem', marginBottom: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Demo interactiva — VoyageAI genera tu itinerario en segundos
            </p>
          </div>
        </div>
      )}
    </section>
  )
}