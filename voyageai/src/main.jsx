import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FlowProvider } from './context/FlowContext'
import './index.css'
import App from './App.jsx'

/*
 * BrowserRouter va aquí (en el nivel más alto) para que
 * toda la app tenga acceso a la navegación.
 * 
 * FlowProvider también va aquí para que el estado del flujo
 * esté disponible en todas las rutas, incluyendo Confirmacion.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FlowProvider>
        <App />
      </FlowProvider>
    </BrowserRouter>
  </StrictMode>
)