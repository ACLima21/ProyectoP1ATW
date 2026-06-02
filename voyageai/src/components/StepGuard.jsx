import { Navigate } from 'react-router-dom'
import { useFlow } from '../context/FlowContext'

/*
 * StepGuard — componente wrapper que protege una ruta.
 * 
 * Verifica la condición antes de renderizar el contenido.
 * Si no se cumple, redirige al lugar correcto.
 * 
 * Uso:
 * <StepGuard>
 *   <ComponenteProtegido />
 * </StepGuard>
 */

export default function StepGuard({ children }) {
  const { formSubmitted } = useFlow()

  if (!formSubmitted) {
    // No llenó el formulario — regresa a la sección de contacto
    return <Navigate to="/#contacto" replace />
  }

  return children
}