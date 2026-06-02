import { Routes, Route } from 'react-router-dom'
import StepGuard     from './components/StepGuard'
import Confirmacion  from './pages/Confirmacion'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import Features      from './components/Features'
import Carousel      from './components/Carousel'
import Stats         from './components/Stats'
import Pricing       from './components/Pricing'
import Contact       from './components/Contact'
import Footer        from './components/Footer'

// Página principal (landing) — todo el scroll de siempre
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
      {/* Ruta pública — landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Ruta protegida — solo accesible tras enviar el formulario */}
      <Route
        path="/confirmacion"
        element={
          <StepGuard>
            <Confirmacion />
          </StepGuard>
        }
      />
    </Routes>
  )
}