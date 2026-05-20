import { FiCompass, FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi'

const LINKS = {
  Producto:  ['Características', 'Precios', 'Integraciones', 'Changelog'],
  Empresa:   ['Sobre nosotros', 'Blog', 'Carreras', 'Prensa'],
  Recursos:  ['Documentación', 'API', 'Comunidad', 'Soporte'],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="nav-logo" style={{ marginBottom: '0' }}>
              <FiCompass style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Voyage<span style={{ color: 'var(--primary-light)' }}>AI</span>
            </div>
            <p>
              Planifica viajes increíbles con inteligencia artificial.
              Más de 200,000 viajeros confían en nosotros.
            </p>
            <div className="footer-social">
              {[FiTwitter, FiInstagram, FiLinkedin, FiGithub].map((Icon, i) => (
                <a key={i} href="#" className="social-btn" aria-label="Red social">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas de links */}
          {Object.entries(LINKS).map(([col, links]) => (
            <div key={col} className="footer-col">
              <h4>{col}</h4>
              <ul className="footer-links">
                {links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© {year} VoyageAI · Todos los derechos reservados</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacidad', 'Términos', 'Cookies'].map(l => (
              <a key={l} href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}