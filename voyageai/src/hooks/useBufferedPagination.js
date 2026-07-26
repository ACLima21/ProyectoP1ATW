import { useState, useEffect, useCallback, useRef } from 'react'

/*
 * useBufferedPagination — paginación con buffer y prefetch silencioso
 *
 * Estrategia:
 * 1. Carga 150 elementos del servidor al iniciar
 * 2. El usuario pagina normalmente (5/10/25/50 por página)
 * 3. Cuando quedan ≤50 elementos en el buffer → prefetch silencioso de 150 más
 * 4. Se descartan los primeros 100 elementos ya vistos para mantener el buffer liviano
 * 5. El usuario nunca ve un loading durante la paginación normal
 */

const BUFFER_SIZE  = 150   // registros que se piden al servidor por lote
const THRESHOLD    = 50    // registros restantes que disparan el prefetch
const DISCARD_SIZE = 100   // registros descartados del frente al hacer prefetch

export function useBufferedPagination(fetchFn, defaultPageSize = 10) {
  const [buffer,        setBuffer]        = useState([])
  const [bufferOffset,  setBufferOffset]  = useState(0)   // items descartados acumulados
  const [serverCursor,  setServerCursor]  = useState(0)   // items totales pedidos al servidor
  const [totalElements, setTotalElements] = useState(0)
  const [displayPage,   setDisplayPage]   = useState(0)   // página dentro del buffer
  const [pageSize,      setPageSizeState] = useState(defaultPageSize)
  const [loading,       setLoading]       = useState(true)
  const [prefetching,   setPrefetching]   = useState(false)
  const isFetching = useRef(false)

  // Carga un lote del servidor
  const fetchBatch = useCallback(async (serverPage) => {
    return fetchFn({ page: serverPage, size: BUFFER_SIZE })
  }, [fetchFn])

  // Carga inicial
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setBuffer([])
    setBufferOffset(0)
    setServerCursor(0)
    setDisplayPage(0)

    fetchBatch(0).then(result => {
      if (cancelled) return
      setBuffer(result.content)
      setTotalElements(result.totalElements)
      setServerCursor(result.content.length)
    }).catch(console.error)
    .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [fetchBatch])

  // Verificar si se necesita prefetch al cambiar de página o tamaño
  useEffect(() => {
    if (loading || isFetching.current || !buffer.length) return

    const itemsConsumed  = (displayPage + 1) * pageSize
    const remaining      = buffer.length - itemsConsumed
    const hasMore        = serverCursor < totalElements

    if (remaining <= THRESHOLD && hasMore) {
      const serverPage = Math.floor(serverCursor / BUFFER_SIZE)
      isFetching.current = true
      setPrefetching(true)

      fetchBatch(serverPage).then(result => {
        setBuffer(prev => {
          // Descarta los primeros DISCARD_SIZE elementos ya vistos
          const trimmed = prev.slice(DISCARD_SIZE)
          return [...trimmed, ...result.content]
        })
        // Ajusta el offset y la página de display para compensar el descarte
        setBufferOffset(prev => prev + DISCARD_SIZE)
        setDisplayPage(prev => {
          const pagesDropped = Math.floor(DISCARD_SIZE / pageSize)
          return Math.max(0, prev - pagesDropped)
        })
        setServerCursor(prev => prev + result.content.length)
      }).catch(console.error)
      .finally(() => {
        setPrefetching(false)
        isFetching.current = false
      })
    }
  }, [displayPage, pageSize, buffer.length,
      serverCursor, totalElements, loading, fetchBatch])

  // Elementos que se muestran en la página actual
  const currentItems = buffer.slice(
    displayPage * pageSize,
    (displayPage + 1) * pageSize
  )

  // Número de página absoluto (para mostrar al usuario)
  const absolutePage = Math.floor(bufferOffset / pageSize) + displayPage
  const totalPages   = Math.ceil(totalElements / pageSize)

  // Navegar a una página absoluta (si está en el buffer actual)
  const goToPage = useCallback((absPage) => {
    const baseInBuffer = Math.floor(bufferOffset / pageSize)
    const relPage      = absPage - baseInBuffer
    const maxRelPage   = Math.ceil(buffer.length / pageSize) - 1
    if (relPage >= 0 && relPage <= maxRelPage) {
      setDisplayPage(relPage)
    }
  }, [bufferOffset, pageSize, buffer.length])

  // Cambia el tamaño de página y resetea a la primera del buffer
  const setPageSize = useCallback((newSize) => {
    setPageSizeState(newSize)
    setDisplayPage(0)
  }, [])

  // Vuelve a cargar desde cero
  const refetch = useCallback(() => {
    isFetching.current = false
    setBuffer([])
    setBufferOffset(0)
    setServerCursor(0)
    setDisplayPage(0)
    setLoading(true)
    fetchBatch(0).then(result => {
      setBuffer(result.content)
      setTotalElements(result.totalElements)
      setServerCursor(result.content.length)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [fetchBatch])

  return {
    items:        currentItems,
    currentPage:  absolutePage,
    totalPages,
    totalElements,
    pageSize,
    setPageSize,
    goToPage,
    nextPage:     () => goToPage(absolutePage + 1),
    prevPage:     () => goToPage(absolutePage - 1),
    loading,
    prefetching,
    refetch,
    hasNext:      absolutePage < totalPages - 1,
    hasPrev:      absolutePage > 0,
  }
}