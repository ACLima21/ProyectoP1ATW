import { useCallback, useRef } from 'react'

// Hook personalizado: añade clase .visible al entrar en el viewport
//
// Usa un CALLBACK REF en vez de useRef + useEffect. La razón:
// con useRef + useEffect(() => {...}, []), el observer se crea una sola
// vez, justo después del PRIMER render. Si en ese primer render el
// elemento con el ref todavía no existe en el DOM (por ejemplo, porque
// el componente estaba mostrando un spinner de "cargando" y el elemento
// real solo aparece en un render posterior), ref.current es null y el
// observer nunca se llega a crear — el elemento se queda invisible para
// siempre.
//
// Con un callback ref, React llama a esta función cada vez que el nodo
// del DOM se asigna o se desmonta, sin importar en qué render ocurra.
// Así el observer se crea siempre en el momento correcto.
export function useScrollReveal() {
  const observerRef = useRef(null)

  const ref = useCallback((node) => {
    // Si había un observer anterior (por ejemplo, el nodo cambió o se
    // desmontó), lo desconectamos antes de seguir.
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (!node) return // el elemento se desmontó, no hay nada que observar

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('visible')
          observer.unobserve(node) // Solo se activa una vez
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    observerRef.current = observer
  }, [])

  return ref
}