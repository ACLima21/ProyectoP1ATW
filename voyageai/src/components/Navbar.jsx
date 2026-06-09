import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { useAuth } from '../context/AuthContext'
import { FiCompass, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

const SECTIONS = ['inicio', 'features', 'destinos', 'precios', 'contacto']
const LABELS   = { inicio: 'Inicio', features: 'Características', destinos: 'Destinos', precios: 'Precios', contacto: 'Contacto' }

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const activeId                          = useScrollSpy(SECTIONS)
  const { user, logout }                  = useAuth()
  const dropdownRef                       = useRef(null)
  const navigate                          = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra el menú móvil cuando cambia la sección activa
  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  }, [activeId])

  // Cierra el dropdown al hacer clic afuera
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">

          {/* Logo */}
          <a className="nav-logo" href="#inicio"
            onClick={(e) => { e.preventDefault(); scrollTo('inicio') }}>
            <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Voyage<span>AI</span>
          </a>

          {/* Links desktop */}
          <ul className="nav-links">
            {SECTIONS.map((id) => (
              <li key={id}>
                <button className={`nav-link ${activeId === id ? 'active' : ''}`}
                  onClick={() => scrollTo(id)}>
                  {LABELS[id]}
                </button>
              </li>
            ))}
          </ul>

          {/* Derecha — DESKTOP */}
          <div className="nav-right">
            <ThemeToggle />

            {user ? (
              /* Usuario logueado */
              <div className="user-menu" ref={dropdownRef}>
                <button className="user-avatar-btn"
                  onClick={() => setDropdownOpen(o => !o)}
                  aria-label="Menú de usuario">
                  <div className="user-avatar">{user.avatar}</div>
                  <span className="user-name">{user.name}</span>
                  <FiChevronDown className={`user-chevron ${dropdownOpen ? 'open' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar user-avatar-lg">{user.avatar}</div>
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="user-dropdown-divider" />
                    <Link to="/dashboard" className="user-dropdown-item"
                      onClick={() => setDropdownOpen(false)}>
                      <FiUser /> Mi panel
                    </Link>
                    <button className="user-dropdown-item danger" onClick={handleLogout}>
                      <FiLogOut /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario no logueado */
              <div className="nav-auth">
                <Link to="/login"    className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }}>Iniciar sesión</Link>
                <Link to="/registro" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>Registrarse</Link>
              </div>
            )}
          </div>

          {/* Derecha — MOBILE */}
          <div className="nav-mobile-right">
            <ThemeToggle />
            <button className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
              <span /><span /><span />
            </button>
          </div>

        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {SECTIONS.map((id) => (
          <button key={id}
            className={`mobile-link ${activeId === id ? 'active' : ''}`}
            onClick={() => scrollTo(id)}>
            {LABELS[id]}
          </button>
        ))}

        <div className="mobile-menu-divider" />

        {user ? (
          <>
            <div className="mobile-user-info">
              <div className="user-avatar">{user.avatar}</div>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>
            <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <FiUser style={{ marginRight: '0.5rem' }} /> Mi panel
            </Link>
            <button className="mobile-link" onClick={handleLogout}
              style={{ color: 'var(--danger)', width: '100%', textAlign: 'left' }}>
              <FiLogOut style={{ marginRight: '0.5rem' }} /> Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-outline"  style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
            <Link to="/registro" className="btn btn-primary"  style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Registrarse</Link>
          </>
        )}
      </div>
    </>
  )
}