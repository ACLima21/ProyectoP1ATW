import { FiChevronLeft, FiChevronRight,
         FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

const PAGE_SIZES = [5, 10, 25, 50]

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  setPageSize,
  goToPage,
  nextPage,
  prevPage,
  hasNext,
  hasPrev,
  prefetching,
}) {
  if (totalPages <= 0) return null

  // Rango de páginas visibles alrededor de la actual (ventana de ±2)
  const getPageRange = () => {
    const delta = 2
    const range = []
    const left  = Math.max(0, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)
    for (let i = left; i <= right; i++) range.push(i)
    return range
  }

  const pageRange    = getPageRange()
  const showFirst    = pageRange[0] > 0
  const showLast     = pageRange[pageRange.length - 1] < totalPages - 1
  const startItem    = currentPage * pageSize + 1
  const endItem      = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div className="pagination-wrap">
      {/* Info de resultados + prefetch indicator */}
      <div className="pagination-info">
        <span>
          Mostrando {startItem}–{endItem} de {totalElements.toLocaleString()}
        </span>
        {prefetching && (
          <span className="pagination-prefetch">
            <span className="auth-spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
            Cargando más...
          </span>
        )}
      </div>

      {/* Controles de navegación */}
      <div className="pagination-controls">
        {/* Primera página */}
        <button className="page-btn" onClick={() => goToPage(0)}
          disabled={!hasPrev} aria-label="Primera página">
          <FiChevronsLeft />
        </button>

        {/* Anterior */}
        <button className="page-btn" onClick={prevPage}
          disabled={!hasPrev} aria-label="Página anterior">
          <FiChevronLeft />
        </button>

        {/* Primer número si hay gap */}
        {showFirst && (
          <>
            <button className="page-btn" onClick={() => goToPage(0)}>1</button>
            {pageRange[0] > 1 && <span className="page-ellipsis">…</span>}
          </>
        )}

        {/* Números de página */}
        {pageRange.map(p => (
          <button
            key={p}
            className={`page-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(p)}
          >
            {p + 1}
          </button>
        ))}

        {/* Último número si hay gap */}
        {showLast && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 2 && (
              <span className="page-ellipsis">…</span>
            )}
            <button className="page-btn" onClick={() => goToPage(totalPages - 1)}>
              {totalPages}
            </button>
          </>
        )}

        {/* Siguiente */}
        <button className="page-btn" onClick={nextPage}
          disabled={!hasNext} aria-label="Página siguiente">
          <FiChevronRight />
        </button>

        {/* Última página */}
        <button className="page-btn" onClick={() => goToPage(totalPages - 1)}
          disabled={!hasNext} aria-label="Última página">
          <FiChevronsRight />
        </button>
      </div>

      {/* Selector de tamaño de página */}
      <div className="pagination-size">
        <span>Por página:</span>
        {PAGE_SIZES.map(size => (
          <button
            key={size}
            className={`size-btn ${pageSize === size ? 'active' : ''}`}
            onClick={() => setPageSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}