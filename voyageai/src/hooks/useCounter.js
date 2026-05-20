import { useState, useEffect, useRef } from 'react'

// Hook: anima un número de 0 al valor objetivo cuando entra en pantalla
export function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = performance.now()
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1)
          // Easing: easeOutQuart
          const eased = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}