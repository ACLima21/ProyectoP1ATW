import { useState, useEffect, useCallback } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { destinoService } from '../services/destinoService.js'
import { useFlow } from '../context/FlowContext'

/*
 * Las imágenes siguen siendo locales — se resuelven via imgKey de la API.
 * Antes: import destinosData from '../data/destinos.json' + IMAGE_MAP hardcodeado
 * Ahora: los datos vienen de GET /api/destinos/carousel (5 destinos fijos,
 *        definidos en el backend por ID), pero las fotos siguen en assets/
 *        porque el backend no sirve archivos estáticos.
 */
import imgTokyo from '../assets/tokyo.jpg'
import imgCusco from '../assets/cusco.jpg'
import imgRoma  from '../assets/roma.jpg'
import imgBali  from '../assets/bali.jpg'
import imgDubai from '../assets/dubai.jpg'

const IMAGE_MAP = {
  tokyo: imgTokyo,
  cusco: imgCusco,
  roma:  imgRoma,
  bali:  imgBali,
  dubai: imgDubai,
}

// Campos que cambiaron al pasar de destinos.json a la API:
//   name        → nombre       (campo de la entidad Java)
//   desc        → descripcion
//   price       → precioDesde  (numérico, no string formateado)
//   tags        → tags         (string "Cultural,Gastronomía", no array)

function parseTags(tagsString) {
  if (!tagsString) return []
  return tagsString.split(',').map(t => t.trim()).filter(Boolean)
}

function formatPrecio(precioDesde) {
  if (!precioDesde) return 'Consultar'
  return `$${Number(precioDesde).toLocaleString()}`
}

const getSlidesVisible = () => {
  if (window.innerWidth >= 1024) return 3
  if (window.innerWidth >= 768)  return 2
  return 1
}

export default function Carousel() {
  const [destinos,      setDestinos]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [current,       setCurrent]       = useState(0)
  const [slidesVisible, setSlidesVisible] = useState(getSlidesVisible)
  const headerRef = useScrollReveal()
  const { setDestinoSeleccionado } = useFlow()

  // Carga desde la API — GET /api/destinos/carousel devuelve un array plano
  // (List<Destino>) con siempre los mismos 5 destinos fijos, NO un Page.
  useEffect(() => {
    destinoService.getCarousel()
      .then(lista => {
        setDestinos(Array.isArray(lista) ? lista : [])
      })
      .catch(err => {
        console.error('Error al cargar destinos del carrusel:', err)
        setDestinos([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Actualizar slidesVisible al cambiar el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setSlidesVisible(getSlidesVisible())
      setCurrent(0)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, destinos.length - slidesVisible)

  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), [])
  const next = useCallback(() => setCurrent(c => Math.min(c + 1, maxIndex)), [maxIndex])

  // "Ver ruta" — guarda el destino elegido en FlowContext y lleva al
  // usuario directo al formulario de creación de itinerario, ya precargado.
  const handleVerRuta = useCallback((destino) => {
    setDestinoSeleccionado(destino)
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }, [setDestinoSeleccionado])

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{
          textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)',
        }}>
          <span className="auth-spinner"
            style={{ width: 28, height: 28, borderWidth: 2.5, display: 'inline-block' }} />
          <p style={{ marginTop: '1rem' }}>Cargando destinos...</p>
        </div>
      </section>
    )
  }

  if (!destinos.length) {
    return (
      <section className="section">
        <div className="container" style={{
          textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)',
        }}>
          No hay destinos disponibles en este momento.
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">

        {/* Header + controles */}
        <div ref={headerRef} className="reveal carousel-header">
          <div>
            <div className="section-tag">Destinos</div>
            <h2 className="section-title">
              Descubre el mundo<br />
              <span className="text-gradient">con VoyageAI</span>
            </h2>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={prev}
              disabled={current === 0} aria-label="Anterior">
              <FiChevronLeft />
            </button>
            <button className="carousel-btn" onClick={next}
              disabled={current >= maxIndex} aria-label="Siguiente">
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
            {destinos.map((d) => {
              // Resolver imagen local via imgKey de la API
              const imgSrc = IMAGE_MAP[d.imgKey]

              // Parsear tags de string CSV a array
              const tags = parseTags(d.tags)

              // Formatear precio numérico
              const precio = formatPrecio(d.precioDesde)

              return (
                <div
                  key={d.id}
                  className="carousel-slide"
                  style={{
                    minWidth: `${100 / slidesVisible}%`,
                    padding: '0 0.5rem',
                  }}
                >
                  <div className="dest-card">
                    <div className="dest-card-img">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={d.nombre}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                          }}
                        />
                      ) : (
                        /* Fallback visual para destinos sin imagen local */
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, #1a1040, #0d0d1a)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '5rem',
                        }}>
                          🌍
                        </div>
                      )}
                    </div>

                    <div className="dest-card-overlay" />

                    <div className="dest-card-content">
                      <div className="dest-card-tags">
                        {tags.map(t => (
                          <span key={t} className="dest-tag">{t}</span>
                        ))}
                      </div>

                      {/* API: d.nombre (antes d.name) */}
                      <h3>{d.nombre}</h3>

                      {/* API: d.descripcion (antes d.desc) */}
                      <p>{d.descripcion}</p>

                      <div className="dest-card-footer">
                        <div className="dest-price">
                          Desde {precio} <span>/ persona</span>
                        </div>
                        <button className="btn btn-primary"
                          style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}
                          onClick={() => handleVerRuta(d)}>
                          Ver ruta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots de navegación — con 5 destinos fijos, esto siempre da entre
            2 y 4 dots (según slidesVisible: 3, 2 o 1), nunca decenas */}
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