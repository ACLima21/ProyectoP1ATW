import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBufferedPagination } from '../hooks/useBufferedPagination'
import { favoritoService } from '../services/favoritoService.js'
import { useFlow } from '../context/FlowContext'
import Pagination from '../components/Pagination'
import ThemeToggle from '../components/ThemeToggle'
import { FiCompass, FiArrowLeft, FiMapPin, FiHeart, FiGlobe } from 'react-icons/fi'

function formatPrecio(precioDesde) {
  if (!precioDesde) return 'Consultar'
  return `$${Number(precioDesde).toLocaleString()}`
}

export default function Favoritos() {
  const navigate = useNavigate()
  const { setDestinoSeleccionado } = useFlow()
  const [removedIds, setRemovedIds] = useState(new Set())

  // Paginación conectada a GET /api/favoritos
  const fetchFavoritos = useCallback(
    ({ page, size }) => favoritoService.getMisFavoritos({ page, size }),
    []
  )

  const {
    items: rawDestinos,
    currentPage, totalPages, totalElements: rawTotalElements,
    pageSize, setPageSize, goToPage,
    nextPage, prevPage, hasNext, hasPrev,
    loading, prefetching,
  } = useBufferedPagination(fetchFavoritos, 10)

  // Filtrado optimista local sin recargas de página
  const destinos = rawDestinos.filter(d => !removedIds.has(d.id))
  const totalElements = Math.max(0, rawTotalElements - removedIds.size)

  const handleQuitarFavorito = async (destinoId) => {
    // Eliminación optimista instantánea
    setRemovedIds(prev => new Set(prev).add(destinoId))

    try {
      await favoritoService.eliminarFavorito(destinoId)
    } catch (err) {
      console.error('Error al quitar de favoritos:', err)
      // Revertir eliminación en caso de falla de red
      setRemovedIds(prev => {
        const next = new Set(prev)
        next.delete(destinoId)
        return next
      })
    }
  }

  const handleElegir = (destino) => {
    setDestinoSeleccionado(destino)
    navigate('/', { state: { scrollTo: 'contacto' } })
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Header */}
      <header className="confirmacion-header">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%',
        }}>
          <div className="nav-logo">
            <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Voyage<span>AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <Link to="/dashboard" className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <FiArrowLeft /> Volver al panel
            </Link>
          </div>
        </div>
      </header>

      <main style={{ padding: '2.5rem 0 4rem' }}>
        <div className="container">

          <div style={{ marginBottom: '2rem' }}>
            <div className="section-tag">Mis Favoritos</div>
            <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
              Tus destinos <span className="text-gradient">preferidos</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {totalElements} destino{totalElements !== 1 ? 's' : ''} guardado{totalElements !== 1 ? 's' : ''} en tu lista de favoritos.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <span className="auth-spinner"
                style={{ width: 28, height: 28, borderWidth: 2.5, display: 'inline-block' }} />
              <p style={{ marginTop: '1rem' }}>Cargando tus favoritos...</p>
            </div>
          ) : destinos.length > 0 ? (
            <div>
              {destinos.map((d) => (
                <div key={d.id} className="card" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.1rem 1.25rem', marginBottom: '0.75rem',
                  gap: '1rem', flexWrap: 'wrap',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(91,79,232,0.12)', color: 'var(--primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem',
                    }}>
                      <FiMapPin />
                    </div>
                    <div>
                      <strong style={{ display: 'block' }}>{d.nombre}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {[d.ciudad, d.pais].filter(Boolean).join(', ') || '—'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => handleQuitarFavorito(d.id)}
                      title="Quitar de favoritos"
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <FiHeart size={20} fill="#ef4444" stroke="#ef4444" />
                    </button>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>{formatPrecio(d.precioDesde)}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>desde / persona</div>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleElegir(d)}
                    >
                      Elegir este destino
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '4rem 1rem', background: 'var(--card-bg, rgba(255,255,255,0.03))',
              borderRadius: '16px', border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
            }}>
              <div style={{
                fontSize: '2.5rem', marginBottom: '1rem', color: '#ef4444', display: 'flex',
                justifyContent: 'center',
              }}>
                <FiHeart fill="#ef4444" opacity={0.3} size={48} />
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Aún no tienes destinos favoritos</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Explora nuestro catálogo de destinos y haz clic en el ícono de corazón para guardar tus preferidos.
              </p>
              <Link to="/destinos" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                <FiGlobe style={{ marginRight: '6px' }} /> Explorar Destinos
              </Link>
            </div>
          )}

          {!loading && destinos.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              setPageSize={setPageSize}
              goToPage={goToPage}
              nextPage={nextPage}
              prevPage={prevPage}
              hasNext={hasNext}
              hasPrev={hasPrev}
              prefetching={prefetching}
            />
          )}

        </div>
      </main>
    </div>
  )
}
