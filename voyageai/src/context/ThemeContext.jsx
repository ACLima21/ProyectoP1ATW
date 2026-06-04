import { createContext, useContext, useState, useEffect } from 'react'

/*
 * ThemeContext — maneja el tema claro/oscuro globalmente.
 *
 * Prioridad de detección (de mayor a menor):
 * 1. Lo que el usuario eligió antes (localStorage)
 * 2. La preferencia del sistema operativo
 * 3. Oscuro por defecto
 */

const ThemeContext = createContext(null)

function getInitialTheme() {
  // 1. ¿Ya eligió antes?
  const saved = localStorage.getItem('voyageai-theme')
  if (saved) return saved

  // 2. ¿Su sistema prefiere claro?
  const preferesLight = window.matchMedia('(prefers-color-scheme: light)').matches
  return preferesLight ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Aplica el tema al <html> y lo guarda en localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('voyageai-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}