import { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBufferedPagination } from '../hooks/useBufferedPagination'
import { destinoService } from '../services/destinoService.js'
import { favoritoService } from '../services/favoritoService.js'
import { useAuth } from '../context/AuthContext'
import { useFlow } from '../context/FlowContext'
import Pagination from '../components/Pagination'
import ThemeToggle from '../components/ThemeToggle'
import { FiCompass, FiArrowLeft, FiMapPin, FiHeart } from 'react-icons/fi'

function formatPrecio(precioDesde) {
  if (!precioDesde) return 'Consultar'
  return `$${Number(precioDesde).toLocaleString()}`
}

export default function Destinos() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setDestinoSeleccionado } = useFlow()

  const [favoritosIds, setFavoritosIds] = useState(new Set())

  // Cargar los favoritos del usuario autenticado
  useEffect(() => {
    if (user) {
      favoritoService.getMisFavoritosIds()
        .then(ids => setFavoritosIds(new Set(ids)))
        .catch(err => console.error('Error al cargar favoritos:', err))
    } else {
      setFavoritosIds(new Set())
    }
  }, [user])

  const toggleFavorito = async (destinoId) => {
    if (!user) {
      navigate('/login')
      return
    }

    const esFavorito = favoritosIds.has(destinoId)

    // Actualización optimista
    setFavoritosIds(prev => {
      const next = new Set(prev)
      if (esFavorito) {
        next.delete(destinoId)
      } else {
        next.add(destinoId)
      }
      return next
    })

    try {
      if (esFavorito) {
        await favoritoService.eliminarFavorito(destinoId)
      } else {
        await favoritoService.agregarFavorito(destinoId)
      }
    } catch (err) {
      console.error('Error al actualizar favorito:', err)
      // Revertir actualización optimista si el backend falla
      setFavoritosIds(prev => {
        const next = new Set(prev)
        if (esFavorito) {
          next.add(destinoId)
        } else {
          next.delete(destinoId)
        }
        return next
      })
    }
  }

  // Mismo patrón exacto que Dashboard.jsx: useBufferedPagination + Pagination.
  const fetchDestinos = useCallback(
    ({ page, size }) => destinoService.getActivos({ page, size }),
    []
  )

  const {
    items: destinos,
    currentPage, totalPages, totalElements,
    pageSize, setPageSize, goToPage,
    nextPage, prevPage, hasNext, hasPrev,
    loading, prefetching,
  } = useBufferedPagination(fetchDestinos, 10)

  const handleElegir = (destino) => {
    setDestinoSeleccionado(destino)
    navigate('/', { state: { scrollTo: 'contacto' } })
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Header mínimo */}
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
            <Link to="/" className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <FiArrowLeft /> Volver
            </Link>
          </div>
        </div>
      </header>

      <main style={{ padding: '2.5rem 0 4rem' }}>
        <div className="container">

          <div style={{ marginBottom: '2rem' }}>
            <div className="section-tag">Destinos</div>
            <h1 className="section-title" style={{ marginTop: '0.5rem' }}>
              Todos nuestros <span className="text-gradient">destinos</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {totalElements} destino{totalElements !== 1 ? 's' : ''} disponibles — elige uno para armar tu itinerario.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <span className="auth-spinner"
                style={{ width: 28, height: 28, borderWidth: 2.5, display: 'inline-block' }} />
              <p style={{ marginTop: '1rem' }}>Cargando destinos...</p>
            </div>
          ) : destinos.length > 0 ? (
            <div>
              {destinos.map((d) => {
                const isFav = favoritosIds.has(d.id)
                return (
                  <div key={d.id} className="card" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.1rem 1.25rem', marginBottom: '0.75rem',
                    gap: '1rem', flexWrap: 'wrap',
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
                        onClick={() => toggleFavorito(d.id)}
                        title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isFav ? '#ef4444' : 'var(--text-muted)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <FiHeart
                          size={20}
                          fill={isFav ? '#ef4444' : 'none'}
                          stroke={isFav ? '#ef4444' : 'currentColor'}
                        />
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
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No hay destinos disponibles en este momento.
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