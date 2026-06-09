import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import { useMemo, useState } from 'react'
import {
  FiCompass, FiLogOut, FiMap, FiHeart,
  FiCalendar, FiTrendingUp, FiArrowRight,
  FiShield, FiSearch
} from 'react-icons/fi'

// Data de ejemplo — en el futuro vendrá de una API filtrada por user.id
const VIAJES_RECIENTES = [
  { id: 1, destino: 'Tokio, Japón',     fecha: '15 Mar 2025', estado: 'Completado', emoji: '🗾' },
  { id: 2, destino: 'Bali, Indonesia',  fecha: '02 Jun 2025', estado: 'Planeado',   emoji: '🏝️' },
  { id: 3, destino: 'Roma, Italia',     fecha: '28 Ago 2025', estado: 'Planeado',   emoji: '🇮🇹' },
]

const ESTADO_COLOR = {
  Completado: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  Planeado:   { bg: 'rgba(91,79,232,0.1)',  color: '#818CF8' },
}

export default function Dashboard() {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()

    const [busqueda, setBusqueda] = useState('')   // ← nuevo

// Filtra los viajes según el texto escrito
const viajesFiltrados = useMemo(() => {
const texto = busqueda.toLowerCase().trim()
if (!texto) return VIAJES_RECIENTES
return VIAJES_RECIENTES.filter(v =>
    v.destino.toLowerCase().includes(texto) ||
    v.estado.toLowerCase().includes(texto)
)
}, [busqueda])
const handleLogout = () => {
    logout()
    navigate('/')
}

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
            <FiCalendar /> Mis Viajes
          </Link>
          <Link to="/#precios" className="dash-nav-item">
            <FiHeart /> Favoritos
          </Link>
        </nav>

{/* Solo visible si es admin */}
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
          <button className="dash-logout-btn" onClick={handleLogout} aria-label="Cerrar sesión">
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
            <p className="dash-welcome-sub">
              Bienvenido a tu panel de viajes
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <Link to="/" className="btn btn-outline" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
              Volver al inicio
            </Link>
          </div>
        </header>

        {/* Stats cards */}
        <div className="dash-stats">
          {[
            { icon: '✈️', label: 'Viajes realizados', val: '3',   color: 'var(--primary-light)' },
            { icon: '🗺️', label: 'Destinos guardados', val: '12',  color: '#F59E0B'              },
            { icon: '❤️', label: 'Favoritos',          val: '8',   color: '#EC4899'              },
            { icon: '⭐', label: 'Valoración media',   val: '4.9', color: '#10B981'              },
          ].map(({ icon, label, val, color }) => (
            <div key={label} className="dash-stat-card card">
              <div className="dash-stat-icon" style={{ color }}>{icon}</div>
              <div className="dash-stat-val" style={{ color }}>{val}</div>
              <div className="dash-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Viajes recientes */}
        <div className="dash-section-card card">
            <div className="dash-section-head">
                <h2>Viajes recientes</h2>
                <button className="btn btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>
                Ver todos <FiArrowRight />
                </button>
            </div>

            {/* Búsqueda */}
            <div className="dash-search-wrap">
                <FiSearch className="dash-search-icon" />
                <input
                type="text"
                className="form-control dash-search-input"
                placeholder="Buscar por destino o estado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                <button
                    className="dash-search-clear"
                    onClick={() => setBusqueda('')}
                    aria-label="Limpiar búsqueda">
                    ✕
                </button>
                )}
            </div>

            {/* Lista filtrada */}
            <div className="dash-viajes">
                {viajesFiltrados.length > 0 ? (
                viajesFiltrados.map(v => (
                    <div key={v.id} className="dash-viaje-item">
                    <div className="dash-viaje-emoji">{v.emoji}</div>
                    <div className="dash-viaje-info">
                        <strong>{v.destino}</strong>
                        <span>{v.fecha}</span>
                    </div>
                    <div className="dash-viaje-estado"
                        style={{
                        background: ESTADO_COLOR[v.estado].bg,
                        color:      ESTADO_COLOR[v.estado].color,
                        }}>
                        {v.estado}
                    </div>
                    </div>
                ))
                ) : (
                <div className="dash-empty">
                    <span>🔍</span>
                    <p>No se encontraron viajes para <strong>"{busqueda}"</strong></p>
                </div>
                )}
            </div>

        </div>

        {/* Próximo destino sugerido */}
        <div className="dash-suggestion card">
          <div className="dash-suggestion-text">
            <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
              IA recomienda
            </div>
            <h3>¿Listo para tu próxima aventura?</h3>
            <p>Basado en tus viajes anteriores, Cusco, Perú podría ser tu próximo destino perfecto.</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Ver itinerario sugerido <FiArrowRight />
            </button>
          </div>
          <div className="dash-suggestion-emoji">🏔️</div>
        </div>

      </main>
    </div>
  )
}