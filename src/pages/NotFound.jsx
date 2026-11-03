import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="tf-empty">
      <h2 className="mb-2">Página no encontrada</h2>
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}
