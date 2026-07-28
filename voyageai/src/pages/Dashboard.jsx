import { useMemo, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBufferedPagination } from '../hooks/useBufferedPagination'
import { itinerarioService } from '../services/itinerarioService'
import Pagination from '../components/Pagination'
import ThemeToggle from '../components/ThemeToggle'
import ItinerarioDetalleModal from '../components/ItinerarioDetalleModal'
import {
  FiCompass, FiLogOut, FiMap, FiHeart, FiCalendar,
  FiTrendingUp, FiArrowRight, FiShield, FiSearch,
  FiSend, FiCheckCircle, FiMapPin, FiFileText, FiGlobe, FiSmile,
  FiEye, FiChevronDown, FiX
} from 'react-icons/fi'

const ESTADO_META = {
  completado: { label: 'Completado', bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  activo: { label: 'Activo', bg: 'rgba(91,79,232,0.12)', color: '#818CF8' },
  borrador: { label: 'Borrador', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  cancelado: { label: 'Cancelado', bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
}

const ESTADOS_VALIDOS = ['borrador', 'activo', 'completado', 'cancelado']

const FILTROS = [
  { key: '', label: 'Todos' },
  { key: 'activo', label: 'Activos' },
  { key: 'borrador', label: 'Borrador' },
  { key: 'completado', label: 'Completados' },
  { key: 'cancelado', label: 'Cancelados' },
]

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalItem, setModalItem] = useState(null)

  // Estado local para reflejar cambios de estado sin recargar
  const [estadosLocales, setEstadosLocales] = useState({})

  const handleLogout = () => { logout(); navigate('/') }

  const fetchItinerarios = useCallback(
    ({ page, size }) =>
      itinerarioService.getMisItinerarios(user.id, { page, size }),
    [user?.id]
  )

  const {
    items: itinerarios,
    currentPage, totalPages, totalElements,
    pageSize, setPageSize, goToPage,
    nextPage, prevPage, hasNext, hasPrev,
    loading, prefetching, refetch,
  } = useBufferedPagination(fetchItinerarios, 5)

  // Fusiona estados locales (cambios optimistas) con los datos del buffer
  const itinerariosConEstado = useMemo(() =>
    itinerarios.map(i => ({
      ...i,
      estado: estadosLocales[i.id] ?? i.estado,
    })),
    [itinerarios, estadosLocales]
  )

  // Filtrado: estado + búsqueda
  const itinerariosFiltrados = useMemo(() => {
    let lista = itinerariosConEstado
    if (filtroEstado) lista = lista.filter(i => i.estado === filtroEstado)
    const texto = busqueda.toLowerCase().trim()
    if (texto) lista = lista.filter(i =>
      i.titulo?.toLowerCase().includes(texto) ||
      i.estado?.toLowerCase().includes(texto) ||
      i.destino?.nombre?.toLowerCase().includes(texto)
    )
    return lista
  }, [itinerariosConEstado, filtroEstado, busqueda])

  // Stats calculadas sobre datos fusionados
  const stats = useMemo(() => ({
    completados: itinerariosConEstado.filter(i => i.estado === 'completado').length,
    activos: itinerariosConEstado.filter(i => i.estado === 'activo').length,
    borradores: itinerariosConEstado.filter(i => i.estado === 'borrador').length,
  }), [itinerariosConEstado])

  // Callback del modal al cambiar estado
  const handleEstadoChanged = useCallback((id, nuevoEstado) => {
    setEstadosLocales(prev => ({ ...prev, [id]: nuevoEstado }))
  }, [])

  // Cambio de estado rápido inline (desde la fila)
  const handleCambiarEstadoInline = useCallback(async (itinerario, nuevoEstado) => {
    const estadoAnterior = estadosLocales[itinerario.id] ?? itinerario.estado
    if (nuevoEstado === estadoAnterior) return
    // Actualización optimista
    setEstadosLocales(prev => ({ ...prev, [itinerario.id]: nuevoEstado }))
    try {
      await itinerarioService.actualizarEstado(itinerario.id, nuevoEstado)
    } catch (err) {
      // Revertir si falla
      setEstadosLocales(prev => ({ ...prev, [itinerario.id]: estadoAnterior }))
      console.error('Error actualizando estado:', err)
    }
  }, [estadosLocales])

  return (
    <div className="dash-page">

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <FiCompass />
          <span>Voyage<strong>AI</strong></span>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Menú</span>
          <Link to="/dashboard" className="dash-nav-item active">
            <FiTrendingUp /> Mi Panel
          </Link>
          <Link to="/destinos" className="dash-nav-item">
            <FiMap /> Destinos
          </Link>
          <Link to="/" state={{ scrollTo: 'precios' }} className="dash-nav-item">
            <FiCalendar /> Planes
          </Link>
          <Link to="/favoritos" className="dash-nav-item">
            <FiHeart /> Favoritos
          </Link>
        </nav>

        {isAdmin && (
          <div className="dash-admin-access">
            <span className="dash-nav-label">Administración</span>
            <Link to="/admin" className="dash-nav-item admin">
              <FiShield /> Panel Admin
            </Link>
          </div>
        )}

        <div className="dash-sidebar-footer">
          <div className="dash-user-info">
            <div className="user-avatar">{user.avatar}</div>
            <div className="dash-user-text">
              <strong>{user.nombre}</strong>
              <span>{user.rol}</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}
            aria-label="Cerrar sesión">
            <FiLogOut />
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="dash-main">

        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-welcome">
              Hola, <span className="text-gradient">{user.nombre}</span>{' '}
              <FiSmile style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
            </h1>
            <p className="dash-welcome-sub">Bienvenido a tu panel de viajes</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <Link to="/" className="btn btn-outline"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
              Volver al inicio
            </Link>
          </div>
        </header>

        {/* Stats cards */}
        <div className="dash-stats">
          {[
            { icon: <FiSend />, label: 'Mis itinerarios', val: totalElements, color: 'var(--primary-light)' },
            { icon: <FiCheckCircle />, label: 'Completados', val: stats.completados, color: '#10B981' },
            { icon: <FiMapPin />, label: 'Activos', val: stats.activos, color: '#F59E0B' },
            { icon: <FiFileText />, label: 'En borrador', val: stats.borradores, color: '#818CF8' },
          ].map(({ icon, label, val, color }) => (
            <div key={label} className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ color }}>{icon}</div>
              <div className="dash-stat-val" style={{ color }}>{val}</div>
              <div className="dash-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Lista de itinerarios */}
        <div className="dash-section-card card">
          <div className="dash-section-head">
            <h2>Mis itinerarios</h2>
            <button className="btn btn-outline"
              onClick={refetch}
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
              Actualizar <FiArrowRight />
            </button>
          </div>

          {/* Filtros de estado (tabs) */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {FILTROS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFiltroEstado(key)}
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem', fontWeight: filtroEstado === key ? 700 : 400,
                  border: `1px solid ${filtroEstado === key ? 'var(--primary-light)' : 'rgba(255,255,255,0.1)'}`,
                  background: filtroEstado === key ? 'rgba(91,79,232,0.15)' : 'rgba(255,255,255,0.03)',
                  color: filtroEstado === key ? 'var(--primary-light)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Búsqueda */}
          <div className="dash-search-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FiSearch className="dash-search-icon" />
            <input
              type="text"
              className="form-control dash-search-input"
              placeholder="Buscar por título, estado o destino..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={busqueda ? { paddingRight: '2.5rem' } : undefined}
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                title="Limpiar búsqueda"
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <FiX size={12} />
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="dash-viajes">
            {loading ? (
              <div className="dash-empty">
                <span className="auth-spinner"
                  style={{ width: 24, height: 24, borderWidth: 2 }} />
                <p style={{ marginTop: '0.75rem' }}>Cargando tus itinerarios...</p>
              </div>
            ) : itinerariosFiltrados.length > 0 ? (
              itinerariosFiltrados.map(v => {
                const estadoActual = estadosLocales[v.id] ?? v.estado
                const estadoMeta = ESTADO_META[estadoActual] || ESTADO_META.borrador
                return (
                  <div key={v.id} className="dash-viaje-item" style={{ alignItems: 'center', gap: '0.75rem' }}>
                    <div className="dash-viaje-emoji" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiMapPin />
                    </div>

                    <div className="dash-viaje-info" style={{ flex: 1, minWidth: 0 }}>
                      <strong>{v.titulo}</strong>
                      <span>
                        {v.destino?.nombre || 'Destino'} ·{' '}
                        {v.fechaInicio} → {v.fechaFin}
                      </span>
                    </div>

                    {/* Selector de estado rápido inline */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <select
                        value={estadoActual}
                        onChange={e => handleCambiarEstadoInline(v, e.target.value)}
                        style={{
                          appearance: 'none',
                          background: estadoMeta.bg,
                          color: estadoMeta.color,
                          border: `1px solid ${estadoMeta.color}33`,
                          borderRadius: '999px',
                          padding: '0.28rem 1.8rem 0.28rem 0.75rem',
                          fontSize: '0.73rem', fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {ESTADOS_VALIDOS.map(e => (
                          <option key={e} value={e}>{ESTADO_META[e].label}</option>
                        ))}
                      </select>
                      <FiChevronDown size={11} style={{
                        position: 'absolute', right: '0.55rem', top: '50%',
                        transform: 'translateY(-50%)',
                        color: estadoMeta.color, pointerEvents: 'none',
                      }} />
                    </div>

                    {/* Botón Ver detalle */}
                    <button
                      onClick={() => setModalItem(v)}
                      title="Ver detalle"
                      style={{
                        background: 'rgba(91,79,232,0.1)',
                        border: '1px solid rgba(91,79,232,0.2)',
                        color: 'var(--primary-light)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.65rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        fontSize: '0.78rem', fontWeight: 600,
                        transition: 'all 0.15s ease', flexShrink: 0,
                      }}
                    >
                      <FiEye size={14} /> Detalle
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="dash-empty">
                <FiSearch size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                <p>
                  {busqueda
                    ? `No se encontraron resultados para "${busqueda}"`
                    : filtroEstado
                      ? `No tienes itinerarios con estado "${ESTADO_META[filtroEstado]?.label}".`
                      : 'Aún no tienes itinerarios. ¡Empieza a planificar tu viaje!'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {!loading && !busqueda && !filtroEstado && (
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

        {/* Sugerencia */}
        <div className="dash-suggestion card">
          <div className="dash-suggestion-text">
            <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
              IA recomienda
            </div>
            <h3>¿Listo para tu próxima aventura?</h3>
            <p>Basado en tus viajes anteriores, Cusco, Perú podría ser tu próximo destino perfecto.</p>
            <Link to="/destinos" className="btn btn-primary"
              style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Ver destinos <FiArrowRight />
            </Link>
          </div>
          <div className="dash-suggestion-emoji" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiGlobe size={48} />
          </div>
        </div>

      </main>

      {/* Modal de detalle */}
      {modalItem && (
        <ItinerarioDetalleModal
          itinerario={{ ...modalItem, estado: estadosLocales[modalItem.id] ?? modalItem.estado }}
          onClose={() => setModalItem(null)}
          onEstadoChanged={handleEstadoChanged}
        />
      )}
    </div>
  )
}