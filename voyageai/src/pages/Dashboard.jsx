import { useMemo, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBufferedPagination } from '../hooks/useBufferedPagination'
import { itinerarioService } from '../services/itinerarioService'
import Pagination from '../components/Pagination'
import ThemeToggle from '../components/ThemeToggle'
import {
  FiCompass, FiLogOut, FiMap, FiHeart, FiCalendar,
  FiTrendingUp, FiArrowRight, FiShield, FiSearch
} from 'react-icons/fi'

const ESTADO_COLOR = {
  completado: { bg: 'rgba(16,185,129,0.1)',  color: '#10B981' },
  activo:     { bg: 'rgba(91,79,232,0.1)',   color: '#818CF8' },
  borrador:   { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
  cancelado:  { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
}

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  const handleLogout = () => { logout(); navigate('/') }

  // fetchFn para el hook de paginación — conectado a la API real
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

  // Filtro de búsqueda — opera sobre el buffer actual (client-side)
  const itinerariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim()
    if (!texto) return itinerarios
    return itinerarios.filter(i =>
      i.titulo?.toLowerCase().includes(texto) ||
      i.estado?.toLowerCase().includes(texto) ||
      i.destino?.nombre?.toLowerCase().includes(texto)
    )
  }, [itinerarios, busqueda])

  // Stats calculadas desde los datos reales del buffer
  const stats = useMemo(() => ({
    completados: itinerarios.filter(i => i.estado === 'completado').length,
    activos:     itinerarios.filter(i => i.estado === 'activo').length,
    borradores:  itinerarios.filter(i => i.estado === 'borrador').length,
  }), [itinerarios])

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
          <Link to="/#destinos" className="dash-nav-item">
            <FiMap /> Destinos
          </Link>
          <Link to="/#precios" className="dash-nav-item">
            <FiCalendar /> Planes
          </Link>
          <Link to="/#contacto" className="dash-nav-item">
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
              Hola, <span className="text-gradient">{user.nombre}</span> 👋
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

        {/* Stats cards — calculadas desde la API */}
        <div className="dash-stats">
          {[
            { icon: '✈️', label: 'Mis itinerarios',   val: totalElements,       color: 'var(--primary-light)' },
            { icon: '✅', label: 'Completados',        val: stats.completados,   color: '#10B981' },
            { icon: '🗺️', label: 'Activos',            val: stats.activos,       color: '#F59E0B' },
            { icon: '📝', label: 'En borrador',        val: stats.borradores,    color: '#818CF8' },
          ].map(({ icon, label, val, color }) => (
            <div key={label} className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ color }}>{icon}</div>
              <div className="dash-stat-val" style={{ color }}>{val}</div>
              <div className="dash-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Lista de itinerarios con paginación buffer */}
        <div className="dash-section-card card">
          <div className="dash-section-head">
            <h2>Mis itinerarios</h2>
            <button className="btn btn-outline"
              onClick={refetch}
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
              Actualizar <FiArrowRight />
            </button>
          </div>

          {/* Búsqueda dentro del buffer */}
          <div className="dash-search-wrap">
            <FiSearch className="dash-search-icon" />
            <input
              type="text"
              className="form-control dash-search-input"
              placeholder="Buscar por título, estado o destino..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="dash-search-clear"
                onClick={() => setBusqueda('')}>✕</button>
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
                const estadoStyle = ESTADO_COLOR[v.estado] || ESTADO_COLOR.borrador
                return (
                  <div key={v.id} className="dash-viaje-item">
                    <div className="dash-viaje-emoji">🗺️</div>
                    <div className="dash-viaje-info">
                      <strong>{v.titulo}</strong>
                      <span>
                        {v.destino?.nombre || 'Destino'} ·{' '}
                        {v.fechaInicio} → {v.fechaFin}
                      </span>
                    </div>
                    <div className="dash-viaje-estado"
                      style={{ background: estadoStyle.bg, color: estadoStyle.color }}>
                      {v.estado}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="dash-empty">
                <span>🔍</span>
                <p>
                  {busqueda
                    ? `No se encontraron resultados para "${busqueda}"`
                    : 'Aún no tienes itinerarios. ¡Empieza a planificar tu viaje!'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Paginación buffer */}
          {!loading && !busqueda && (
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
            <Link to="/#destinos" className="btn btn-primary"
              style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Ver destinos <FiArrowRight />
            </Link>
          </div>
          <div className="dash-suggestion-emoji">🏔️</div>
        </div>

      </main>
    </div>
  )
}