import { createContext, useContext, useState } from 'react'

/*
 * FlowContext — estado global del flujo del usuario.
 * 
 * Cualquier componente puede leer o modificar formSubmitted
 * sin necesidad de pasar props entre niveles.
 * 
 * Cuando el proyecto crezca, aquí puedes agregar más flags:
 * productoSeleccionado, pagoRealizado, etc.
 */

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  const [formSubmitted, setFormSubmitted] = useState(false)

  return (
    <FlowContext.Provider value={{ formSubmitted, setFormSubmitted }}>
      {children}
    </FlowContext.Provider>
  )
}

// Hook personalizado para consumir el contexto más fácil
export function useFlow() {
  return useContext(FlowContext)
}