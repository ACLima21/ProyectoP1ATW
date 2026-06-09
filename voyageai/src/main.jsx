import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { FlowProvider }  from './context/FlowContext'
import './index.css'
import App from './App.jsx'

/*
 * Orden de los providers (de afuera hacia adentro):
 * BrowserRouter → habilita navegación en toda la app
 * ThemeProvider → tema claro/oscuro (más global de todo)
 * AuthProvider  → sesión del usuario
 * FlowProvider  → estado del formulario de contacto
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FlowProvider>
            <App />
          </FlowProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)