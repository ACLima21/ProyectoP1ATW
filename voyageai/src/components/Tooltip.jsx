// Componente Tooltip reutilizable con estado React
export default function Tooltip({ children, text }) {
  return (
    <span className="tooltip-wrap">
      {children}
      <span className="tooltip-box" role="tooltip">{text}</span>
    </span>
  )
}