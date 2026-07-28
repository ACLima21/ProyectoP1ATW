import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import AuthGuard     from './components/AuthGuard'
import GuestGuard    from './components/GuestGuard'
import StepGuard     from './components/StepGuard'
import Login         from './pages/Login'
import Registro      from './pages/Registro'
import Confirmacion  from './pages/Confirmacion'
import Destinos      from './pages/Destinos'
import Favoritos     from './pages/Favoritos'
import NoAutorizado  from './pages/NoAutorizado'
import Dashboard     from './pages/Dashboard'
import AdminPanel    from './pages/AdminPanel'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import Features      from './components/Features'
import Carousel      from './components/Carousel'
import Stats         from './components/Stats'
import Pricing       from './components/Pricing'
import Contact       from './components/Contact'
import Footer        from './components/Footer'

function LandingPage() {
  const location = useLocation()
  const navigate  = useNavigate()

  // Permite que otras páginas (ej. /destinos) naveguen de vuelta aquí y
  // pidan hacer scroll a una sección específica, pasando
  // navigate('/', { state: { scrollTo: 'contacto' } }).
  // Un simple scrollIntoView no serviría porque esa navegación viene de
  // OTRA ruta — hay que esperar a que esta página monte primero.
  useEffect(() => {
    const targetId = location.state?.scrollTo
    if (!targetId) return

    // Pequeño delay para asegurar que todas las secciones ya se
    // renderizaron antes de intentar hacer scroll.
    const timer = setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    // Limpia el state para que el scroll no se repita si el usuario
    // navega internamente después (ej. con el botón "atrás").
    navigate(location.pathname, { replace: true, state: {} })

    return () => clearTimeout(timer)
    // Solo al montar — no depende de location.state para evitar un loop
    // con el navigate() de limpieza de arriba.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section id="inicio">   <Hero />     </section>
        <section id="features"> <Features /> </section>
        <section id="destinos"> <Carousel /> </section>
        <section id="stats">    <Stats />    </section>
        <section id="precios">  <Pricing />  </section>
        <section id="contacto"> <Contact />  </section>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>

      {/* ── Pública ── */}
      <Route path="/"              element={<LandingPage />} />
      <Route path="/destinos"      element={<Destinos />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />

      {/* ── Solo para no logueados ── */}
      <Route path="/login" element={
        <GuestGuard><Login /></GuestGuard>
      } />
      <Route path="/registro" element={
        <GuestGuard><Registro /></GuestGuard>
      } />

      {/* ── Requiere formulario completado ── */}
      <Route path="/confirmacion" element={
        <StepGuard><Confirmacion /></StepGuard>
      } />

      {/* ── Requiere login (cualquier rol) ── */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      <Route path="/favoritos" element={
        <AuthGuard>
          <Favoritos />
        </AuthGuard>
      } />

      {/* ── Requiere rol administrador ── */}
      <Route path="/admin" element={
        <AuthGuard requiredRole="administrador">
          <AdminPanel />
        </AuthGuard>
      } />

    </Routes>
  )
}