import { useState, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBufferedPagination } from '../hooks/useBufferedPagination'
import { usuarioService } from '../services/usuarioService'
import { destinoService } from '../services/destinoService'
import { adminDestinoService } from '../services/adminDestinoService'
import Pagination from '../components/Pagination'
import ThemeToggle from '../components/ThemeToggle'
import {
  FiShield, FiCompass, FiLogOut, FiUsers, FiGlobe,
  FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSearch,
} from 'react-icons/fi'

/* ─────────────────────────────────────────────────────────────────
   MODAL — DESTINO (crear y editar)
───────────────────────────────────────────────────────────────── */
const DESTINO_INIT = {
  nombre: '', ciudad: '', pais: '', region: '',
  continente: '', precioDesde: '', descripcion: '',
  clima: '', idiomaPrincipal: '', zonaHoraria: '', moneda: 'USD',
}

function DestinoModal({ destino, onClose, onSaved }) {
  const [form,    setForm]    = useState(destino
    ? { ...DESTINO_INIT, ...destino, precioDesde: destino.precioDesde ?? '' }
    : DESTINO_INIT)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.pais.trim())   e.pais   = 'El país es obligatorio'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const datos = {
        ...form,
        precioDesde: form.precioDesde !== '' ? parseFloat(form.precioDesde) : null,
        activo: true,
      }
      if (destino?.id) {
        await adminDestinoService.actualizar(destino.id, datos)
      } else {
        await adminDestinoService.crear(datos)
      }
      onSaved()
    } catch (err) {
      setErrors({ global: err.message || 'Error al guardar' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal admin-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 640, textAlign: 'left' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ color: 'var(--white)', marginBottom: '1.5rem' }}>
          {destino?.id ? '✏️ Editar destino' : '🌍 Nuevo destino'}
        </h3>

        {errors.global && (
          <div className="auth-error-global">⚠️ {errors.global}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input name="nombre"
                className={`form-control ${errors.nombre ? 'error' : ''}`}
                value={form.nombre} onChange={handleChange}
                placeholder="Ej: Tokio, Japón" />
              {errors.nombre && <p className="form-error">{errors.nombre}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">País *</label>
              <input name="pais"
                className={`form-control ${errors.pais ? 'error' : ''}`}
                value={form.pais} onChange={handleChange}
                placeholder="Ej: Japón" />
              {errors.pais && <p className="form-error">{errors.pais}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input name="ciudad" className="form-control"
                value={form.ciudad} onChange={handleChange}
                placeholder="Ej: Tokio" />
            </div>
            <div className="form-group">
              <label className="form-label">Continente</label>
              <select name="continente" className="form-control"
                value={form.continente} onChange={handleChange}>
                <option value="">Seleccionar</option>
                {['Asia Oriental','Europa Meridional','Sudamérica',
                  'Asia Pacífico','Oriente Medio','América del Norte',
                  'África','Oceanía'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio desde (USD)</label>
              <input name="precioDesde" type="number" min="0"
                className="form-control"
                value={form.precioDesde} onChange={handleChange}
                placeholder="Ej: 1200" />
            </div>
            <div className="form-group">
              <label className="form-label">Clima</label>
              <input name="clima" className="form-control"
                value={form.clima} onChange={handleChange}
                placeholder="Ej: Templado y húmedo" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Idioma principal</label>
              <input name="idiomaPrincipal" className="form-control"
                value={form.idiomaPrincipal} onChange={handleChange}
                placeholder="Ej: Japonés" />
            </div>
            <div className="form-group">
              <label className="form-label">Zona horaria</label>
              <input name="zonaHoraria" className="form-control"
                value={form.zonaHoraria} onChange={handleChange}
                placeholder="Ej: UTC+9" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea name="descripcion" className="form-control"
              value={form.descripcion} onChange={handleChange}
              placeholder="Describe el destino..."
              style={{ minHeight: 80 }} />
          </div>

          <div style={{
            display: 'flex', gap: '1rem',
            justifyContent: 'flex-end', marginTop: '1.5rem',
          }}>
            <button type="button" className="btn btn-outline"
              onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary"
              disabled={loading}>
              {loading ? 'Guardando...' : destino?.id ? 'Actualizar' : 'Crear destino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MODAL — USUARIO (solo crear)
───────────────────────────────────────────────────────────────── */
const USUARIO_INIT = { nombre: '', correo: '', password: '', rol: 'usuario' }

function UsuarioModal({ onClose, onSaved }) {
  const [form,    setForm]    = useState(USUARIO_INIT)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (form.nombre.trim().length < 2)                     e.nombre   = 'Mínimo 2 caracteres'
    if (!form.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.correo   = 'Email inválido'
    if (form.password.length < 6)                          e.password = 'Mínimo 6 caracteres'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await usuarioService.crear({
        ...form,
        avatar: form.nombre.slice(0, 2).toUpperCase(),
      })
      onSaved()
    } catch (err) {
      setErrors({ global: err.message || 'Error al crear usuario' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal admin-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 460, textAlign: 'left' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ color: 'var(--white)', marginBottom: '1.5rem' }}>
          👤 Nuevo usuario
        </h3>

        {errors.global && (
          <div className="auth-error-global">⚠️ {errors.global}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input name="nombre"
              className={`form-control ${errors.nombre ? 'error' : ''}`}
              value={form.nombre} onChange={handleChange}
              placeholder="Nombre completo" autoComplete="off" />
            {errors.nombre && <p className="form-error">{errors.nombre}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Correo *</label>
            <input name="correo" type="email"
              className={`form-control ${errors.correo ? 'error' : ''}`}
              value={form.correo} onChange={handleChange}
              placeholder="correo@ejemplo.com" autoComplete="off" />
            {errors.correo && <p className="form-error">{errors.correo}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <input name="password" type="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              value={form.password} onChange={handleChange}
              placeholder="Mínimo 6 caracteres" />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Rol</label>
            <select name="rol" className="form-control"
              value={form.rol} onChange={handleChange}>
              <option value="usuario">Usuario</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div style={{
            display: 'flex', gap: '1rem',
            justifyContent: 'flex-end', marginTop: '1.5rem',
          }}>
            <button type="button" className="btn btn-outline"
              onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary"
              disabled={loading}>
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MODAL — CONFIRMACIÓN DE DESACTIVACIÓN
───────────────────────────────────────────────────────────────── */
function ConfirmModal({ mensaje, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false)
  const handleConfirm = async () => {
    setLoading(true)
    try { await onConfirm() }
    finally { setLoading(false) }
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}
        style={{ maxWidth: 420 }}>
        <div className="modal-icon" style={{
          background: 'rgba(239,68,68,0.1)',
          borderColor: 'var(--danger)',
          color: 'var(--danger)',
        }}>
          🗑️
        </div>
        <h3>¿Confirmar desactivación?</h3>
        <p>{mensaje}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg,#EF4444,#DC2626)',
              boxShadow: '0 8px 30px rgba(239,68,68,0.4)',
            }}
            onClick={handleConfirm}
            disabled={loading}>
            {loading ? 'Desactivando...' : 'Sí, desactivar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   PANEL ADMIN PRINCIPAL
───────────────────────────────────────────────────────────────── */
export default function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab,    setActiveTab]    = useState('usuarios')
  const [busqueda,     setBusqueda]     = useState('')
  const [modalDestino, setModalDestino] = useState(null)  // null | { data: obj|null }
  const [modalUsuario, setModalUsuario] = useState(false)
  const [confirm,      setConfirm]      = useState(null)  // null | { msg, fn }

  const handleLogout = () => { logout(); navigate('/') }

  /* ── fetch functions ── */
  const fetchUsuarios = useCallback(
    ({ page, size }) => usuarioService.getAll({ page, size }),
    []
  )
  const fetchDestinos = useCallback(
    ({ page, size }) => destinoService.getAll({ page, size }),
    []
  )

  /* ── hooks de paginación ── */
  const usuariosPag = useBufferedPagination(fetchUsuarios, 10)
  const destinosPag = useBufferedPagination(fetchDestinos, 10)

  /* ── filtros client-side ── */
  const usuariosFiltrados = useMemo(() => {
    const t = busqueda.toLowerCase().trim()
    if (!t) return usuariosPag.items
    return usuariosPag.items.filter(u =>
      u.nombre?.toLowerCase().includes(t) ||
      u.correo?.toLowerCase().includes(t) ||
      u.rol?.toLowerCase().includes(t)
    )
  }, [usuariosPag.items, busqueda])

  const destinosFiltrados = useMemo(() => {
    const t = busqueda.toLowerCase().trim()
    if (!t) return destinosPag.items
    return destinosPag.items.filter(d =>
      d.nombre?.toLowerCase().includes(t) ||
      d.pais?.toLowerCase().includes(t) ||
      d.continente?.toLowerCase().includes(t)
    )
  }, [destinosPag.items, busqueda])

  /* ── acciones ── */
  const confirmAction = (msg, fn) => setConfirm({ msg, fn })

  const handleDesactivarUsuario = (id) =>
    confirmAction(
      'El usuario quedará desactivado. Su historial de viajes se conservará intacto.',
      async () => {
        await usuarioService.desactivar(id)
        setConfirm(null)
        usuariosPag.refetch()
      }
    )

  const handleDesactivarDestino = (id) =>
    confirmAction(
      'El destino dejará de aparecer en la plataforma para los usuarios.',
      async () => {
        await adminDestinoService.desactivar(id)
        setConfirm(null)
        destinosPag.refetch()
      }
    )

  const pag = activeTab === 'usuarios' ? usuariosPag : destinosPag

  /* ── helpers visuales ── */
  const Badge = ({ label, style }) => (
    <span className="admin-badge" style={style}>{label}</span>
  )

  return (
    <div className="dash-page">

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <FiCompass />
          <span>Voyage<strong>AI</strong></span>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Administración</span>
          <button
            className={`dash-nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => { setActiveTab('usuarios'); setBusqueda('') }}>
            <FiUsers /> Usuarios
          </button>
          <button
            className={`dash-nav-item ${activeTab === 'destinos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('destinos'); setBusqueda('') }}>
            <FiGlobe /> Destinos
          </button>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
          <span className="dash-nav-label">Navegación</span>
          <Link to="/dashboard" className="dash-nav-item">
            <FiArrowLeft /> Mi Dashboard
          </Link>
          <Link to="/" className="dash-nav-item">
            <FiCompass /> Inicio
          </Link>
        </div>

        <div className="dash-sidebar-footer">
          <div className="dash-user-info">
            <div className="user-avatar"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}>
              {user.avatar}
            </div>
            <div className="dash-user-text">
              <strong>{user.nombre}</strong>
              <span style={{ color: '#F59E0B' }}>Administrador</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}
            aria-label="Cerrar sesión">
            <FiLogOut />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">

        {/* Header */}
        <header className="dash-header">
          <div>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: '0.5rem', marginBottom: '0.25rem',
            }}>
              <FiShield style={{ color: '#F59E0B' }} />
              <span style={{
                fontSize: '0.75rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#F59E0B',
              }}>
                Panel de Administración
              </span>
            </div>
            <h1 className="dash-welcome">
              {activeTab === 'usuarios' ? '👥 Gestión de Usuarios' : '🌍 Gestión de Destinos'}
            </h1>
            <p className="dash-welcome-sub">
              {activeTab === 'usuarios'
                ? `${usuariosPag.totalElements.toLocaleString()} usuarios en el sistema`
                : `${destinosPag.totalElements.toLocaleString()} destinos en el catálogo`
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <ThemeToggle />
            <button
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              onClick={() =>
                activeTab === 'usuarios'
                  ? setModalUsuario(true)
                  : setModalDestino({ data: null })
              }>
              <FiPlus />
              {activeTab === 'usuarios' ? 'Nuevo usuario' : 'Nuevo destino'}
            </button>
          </div>
        </header>

        {/* Stats rápidas */}
        <div className="dash-stats" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
          {activeTab === 'usuarios' ? (
            <>
              {[
                { icon: '👥', label: 'Total usuarios', val: usuariosPag.totalElements, color: 'var(--primary-light)' },
                { icon: '🛡️', label: 'Administradores',
                  val: usuariosPag.items.filter(u => u.rol === 'administrador').length + '+',
                  color: '#F59E0B' },
                { icon: '✅', label: 'Activos',
                  val: usuariosPag.items.filter(u => u.activo).length + '+',
                  color: '#10B981' },
                { icon: '🚫', label: 'Inactivos',
                  val: usuariosPag.items.filter(u => !u.activo).length + '+',
                  color: '#EF4444' },
              ].map(({ icon, label, val, color }) => (
                <div key={label} className="dash-stat-card card">
                  <div className="dash-stat-icon" style={{ color }}>{icon}</div>
                  <div className="dash-stat-val"  style={{ color, fontSize: '1.5rem' }}>{val}</div>
                  <div className="dash-stat-label">{label}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { icon: '🌍', label: 'Total destinos',  val: destinosPag.totalElements, color: 'var(--primary-light)' },
                { icon: '✅', label: 'Activos',
                  val: destinosPag.items.filter(d => d.activo).length + '+',
                  color: '#10B981' },
                { icon: '🚫', label: 'Inactivos',
                  val: destinosPag.items.filter(d => !d.activo).length + '+',
                  color: '#EF4444' },
                { icon: '💰', label: 'Precio promedio',
                  val: (() => {
                    const precios = destinosPag.items
                      .filter(d => d.precioDesde)
                      .map(d => d.precioDesde)
                    return precios.length
                      ? `$${Math.round(precios.reduce((a,b)=>a+b,0)/precios.length).toLocaleString()}`
                      : '—'
                  })(),
                  color: '#F59E0B',
                },
              ].map(({ icon, label, val, color }) => (
                <div key={label} className="dash-stat-card card">
                  <div className="dash-stat-icon" style={{ color }}>{icon}</div>
                  <div className="dash-stat-val"  style={{ color, fontSize: '1.5rem' }}>{val}</div>
                  <div className="dash-stat-label">{label}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Buscador */}
        <div className="dash-section-card card" style={{ paddingBottom: '1.25rem' }}>
          <div className="dash-search-wrap" style={{ marginBottom: 0 }}>
            <FiSearch className="dash-search-icon" />
            <input
              type="text"
              className="form-control dash-search-input"
              placeholder={activeTab === 'usuarios'
                ? 'Buscar por nombre, correo o rol...'
                : 'Buscar por nombre, país o continente...'
              }
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="dash-search-clear"
                onClick={() => setBusqueda('')}>✕</button>
            )}
          </div>
        </div>

        {/* ── Tabla de Usuarios ── */}
        {activeTab === 'usuarios' && (
          <div className="dash-section-card card">
            <div className="admin-table-wrap">
              {usuariosPag.loading
                ? <div className="dash-empty">
                    <span className="auth-spinner" style={{ width:24, height:24 }} />
                    <p style={{ marginTop:'0.75rem' }}>Cargando usuarios...</p>
                  </div>
                : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.length === 0
                        ? <tr><td colSpan={7} className="admin-empty-row">
                            No se encontraron usuarios
                          </td></tr>
                        : usuariosFiltrados.map(u => (
                          <tr key={u.id}>
                            <td className="admin-td-muted">#{u.id}</td>
                            <td>
                              <div className="user-avatar"
                                style={{ width:30, height:30, fontSize:'0.7rem' }}>
                                {u.avatar || u.nombre?.slice(0,2).toUpperCase()}
                              </div>
                            </td>
                            <td className="admin-td-main">{u.nombre}</td>
                            <td className="admin-td-muted">{u.correo}</td>
                            <td>
                              <Badge label={u.rol}
                                style={u.rol === 'administrador'
                                  ? { background:'rgba(245,158,11,0.15)', color:'#F59E0B' }
                                  : { background:'rgba(91,79,232,0.15)',  color:'#818CF8' }
                                } />
                            </td>
                            <td>
                              <Badge label={u.activo ? 'Activo' : 'Inactivo'}
                                style={u.activo
                                  ? { background:'rgba(16,185,129,0.1)',  color:'#10B981' }
                                  : { background:'rgba(239,68,68,0.1)',   color:'#EF4444' }
                                } />
                            </td>
                            <td>
                              {u.activo && (
                                <button className="admin-action-btn danger"
                                  onClick={() => handleDesactivarUsuario(u.id)}
                                  title="Desactivar usuario">
                                  <FiTrash2 />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                )
              }
            </div>
            {!busqueda && <Pagination {...usuariosPag} />}
          </div>
        )}

        {/* ── Tabla de Destinos ── */}
        {activeTab === 'destinos' && (
          <div className="dash-section-card card">
            <div className="admin-table-wrap">
              {destinosPag.loading
                ? <div className="dash-empty">
                    <span className="auth-spinner" style={{ width:24, height:24 }} />
                    <p style={{ marginTop:'0.75rem' }}>Cargando destinos...</p>
                  </div>
                : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>País</th>
                        <th>Continente</th>
                        <th>Precio desde</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinosFiltrados.length === 0
                        ? <tr><td colSpan={7} className="admin-empty-row">
                            No se encontraron destinos
                          </td></tr>
                        : destinosFiltrados.map(d => (
                          <tr key={d.id}>
                            <td className="admin-td-muted">#{d.id}</td>
                            <td className="admin-td-main">{d.nombre}</td>
                            <td className="admin-td-muted">{d.pais}</td>
                            <td className="admin-td-muted">{d.continente}</td>
                            <td style={{ color:'#10B981', fontWeight:600 }}>
                              {d.precioDesde
                                ? `$${Number(d.precioDesde).toLocaleString()}`
                                : '—'}
                            </td>
                            <td>
                              <Badge label={d.activo ? 'Activo' : 'Inactivo'}
                                style={d.activo
                                  ? { background:'rgba(16,185,129,0.1)', color:'#10B981' }
                                  : { background:'rgba(239,68,68,0.1)',  color:'#EF4444' }
                                } />
                            </td>
                            <td style={{ display:'flex', gap:'0.5rem' }}>
                              <button className="admin-action-btn"
                                onClick={() => setModalDestino({ data: d })}
                                title="Editar destino">
                                <FiEdit2 />
                              </button>
                              {d.activo && (
                                <button className="admin-action-btn danger"
                                  onClick={() => handleDesactivarDestino(d.id)}
                                  title="Desactivar destino">
                                  <FiTrash2 />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                )
              }
            </div>
            {!busqueda && <Pagination {...destinosPag} />}
          </div>
        )}

      </main>

      {/* ── Modales ── */}
      {modalDestino && (
        <DestinoModal
          destino={modalDestino.data}
          onClose={() => setModalDestino(null)}
          onSaved={() => { setModalDestino(null); destinosPag.refetch() }}
        />
      )}

      {modalUsuario && (
        <UsuarioModal
          onClose={() => setModalUsuario(false)}
          onSaved={() => { setModalUsuario(false); usuariosPag.refetch() }}
        />
      )}

      {confirm && (
        <ConfirmModal
          mensaje={confirm.msg}
          onConfirm={confirm.fn}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}