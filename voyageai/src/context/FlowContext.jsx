import { createContext, useContext, useState } from 'react'

/*
 * FlowContext — estado global del flujo del usuario.
 * 
 * Cualquier componente puede leer o modificar formSubmitted
 * sin necesidad de pasar props entre niveles.
 *
 * destinoSeleccionado: guarda el destino elegido con "Ver ruta" en el
 * Carousel, para que Contact.jsx pueda precargarlo en el formulario de
 * creación de itinerario sin que el usuario tenga que volver a escribirlo.
 *
 * ultimoItinerario: guarda el itinerario recién creado (la respuesta real
 * de POST /api/itinerarios/completo) para que Confirmacion.jsx pueda
 * mostrar sus datos reales en vez de un mensaje genérico. Vive solo en
 * memoria — si el usuario recarga /confirmacion, se pierde (el itinerario
 * sigue existiendo en la BD, pero esta página no lo vuelve a buscar).
 * 
 * Cuando el proyecto crezca, aquí puedes agregar más flags:
 * pagoRealizado, etc.
 */

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  const [formSubmitted,       setFormSubmitted]       = useState(false)
  const [destinoSeleccionado, setDestinoSeleccionado]  = useState(null)
  const [ultimoItinerario,    setUltimoItinerario]     = useState(null)

  return (
    <FlowContext.Provider value={{
      formSubmitted, setFormSubmitted,
      destinoSeleccionado, setDestinoSeleccionado,
      ultimoItinerario, setUltimoItinerario,
    }}>
      {children}
    </FlowContext.Provider>
  )
}

// Hook personalizado para consumir el contexto más fácil
export function useFlow() {
  return useContext(FlowContext)
}