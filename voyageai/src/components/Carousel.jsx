import { useState, useEffect, useCallback } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
// ── Imágenes locales ──────────────────────────────────────────
import imgTokyo from '../assets/tokyo.jpg'
import imgCusco from '../assets/cusco.jpg'
import imgRoma  from '../assets/roma.jpg'
import imgBali  from '../assets/bali.jpg'
import imgDubai from '../assets/dubai.jpg'
// ── Data desde JSON ───────────────────────────────────────────
import destinosData from '../data/destinos.json'

/*
 * Mapa de claves → imágenes locales.
 * 
 * Explicación del mapa de claves:
 * JSON solo guarda texto. Las imágenes en React se importan como módulos.
 * Este mapa conecta la clave de texto del JSON con el módulo de imagen.
 *
 * Cuando se migre a una API real, el backend devolverá URLs directas
 * ("imgUrl": "https://cdn.voyageai.com/tokyo.jpg"), y se eliminará
 * este mapa y usar d.imgUrl directamente. El resto del componente
 * no necesita ningún cambio.
 */
const IMAGE_MAP = {
  tokyo: imgTokyo,
  cusco: imgCusco,
  roma:  imgRoma,
  bali:  imgBali,
  dubai: imgDubai,
}

// Enriquecer el JSON resolviendo la imagen correspondiente
const DESTINOS = destinosData.map(d => ({
  ...d,
  img: IMAGE_MAP[d.imgKey],
}))

// Cuántas slides se muestran según el viewport
export default function Carousel() {
  const [current, setCurrent] = useState(0)

  const getSlidesVisible = () => {
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 768)  return 2
    return 1
  }

  const [slidesVisible, setSlidesVisible] = useState(getSlidesVisible)

  // Escucha cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const next = getSlidesVisible()
      setSlidesVisible(next)
      setCurrent(0) // resetea posición al cambiar breakpoint
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = DESTINOS.length - slidesVisible
  const headerRef = useScrollReveal()

  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [])
  const next = useCallback(() => setCurrent(c => Math.min(c + 1, maxIndex)), [maxIndex])

  return (
    <section className="section">
      <div className="container">
        {/* Header + controles */}
        <div ref={headerRef} className="reveal carousel-header">
          <div>
            <div className="section-tag">Destinos</div>
            <h2 className="section-title">Descubre el mundo<br /><span className="text-gradient">con VoyageAI</span></h2>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={prev} disabled={current === 0} aria-label="Anterior">
              <FiChevronLeft />
            </button>
            <button className="carousel-btn" onClick={next} disabled={current >= maxIndex} aria-label="Siguiente">
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Track del carrusel */}
        <div className="carousel-track-wrap">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${current * (100 / slidesVisible)}%)` }}
          >
            {DESTINOS.map((d) => (
              <div
                key={d.name}
                className="carousel-slide"
                style={{ minWidth: `${100 / slidesVisible}%`, padding: '0 0.5rem' }}
              >
                <div className="dest-card">
                    <div className="dest-card-img">
                        <img
                            src={d.img}
                            alt={d.name}
                            style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            }}
                        />
                    </div>
                  <div className="dest-card-overlay" />
                  <div className="dest-card-content">
                    <div className="dest-card-tags">
                      {d.tags.map(t => <span key={t} className="dest-tag">{t}</span>)}
                    </div>
                    <h3>{d.name}</h3>
                    <p>{d.desc}</p>
                    <div className="dest-card-footer">
                      <div className="dest-price">
                        Desde {d.price} <span>/ persona</span>
                      </div>
                      <button className="btn btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}>
                        Ver ruta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots de navegación */}
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${current === i ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}