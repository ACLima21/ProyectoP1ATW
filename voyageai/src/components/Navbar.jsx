import { useState, useEffect } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { FiCompass } from 'react-icons/fi'

const SECTIONS = ['inicio', 'features', 'destinos', 'precios', 'contacto']
const LABELS   = { inicio: 'Inicio', features: 'Características', destinos: 'Destinos', precios: 'Precios', contacto: 'Contacto' }

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const activeId = useScrollSpy(SECTIONS)

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar menú móvil al hacer scroll
  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  }, [activeId])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          {/* Logo */}
          <a className="nav-logo" href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('inicio') }}>
            <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Voyage<span>AI</span>
          </a>

          {/* Links desktop */}
          <ul className="nav-links">
            {SECTIONS.map((id) => (
              <li key={id}>
                <button
                  className={`nav-link ${activeId === id ? 'active' : ''}`}
                  onClick={() => scrollTo(id)}
                >
                  {LABELS[id]}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA desktop */}
          <button className="btn btn-primary nav-cta" onClick={() => scrollTo('contacto')} style={{ padding: '0.6rem 1.5rem' }}>
            Empezar gratis
          </button>

          {/* Hamburger mobile */}
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {SECTIONS.map((id) => (
          <button key={id} className={`mobile-link ${activeId === id ? 'active' : ''}`} onClick={() => scrollTo(id)}>
            {LABELS[id]}
          </button>
        ))}
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => scrollTo('contacto')}>
          Empezar gratis
        </button>
      </div>
    </>
  )
}