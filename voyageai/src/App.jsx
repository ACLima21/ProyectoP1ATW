import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Carousel from './components/Carousel'
import Stats from './components/Stats'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
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
    </div>
  )
}

export default App