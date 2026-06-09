import { Routes, Route } from 'react-router-dom'
import AuthGuard     from './components/AuthGuard'
import GuestGuard    from './components/GuestGuard'
import StepGuard     from './components/StepGuard'
import Login         from './pages/Login'
import Registro      from './pages/Registro'
import Confirmacion  from './pages/Confirmacion'
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

      {/* ── Requiere rol administrador ── */}
      <Route path="/admin" element={
        <AuthGuard requiredRole="administrador">
          <AdminPanel />
        </AuthGuard>
      } />

    </Routes>
  )
}