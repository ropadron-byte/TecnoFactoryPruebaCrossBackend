import { Alert, Pagination, Spinner } from 'react-bootstrap'

export function Loading({ label = 'Cargando…' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-4" role="status">
      <Spinner size="sm" animation="border" /> {label}
    </div>
  )
}

export function ErrorBox({ error, onRetry }) {
  if (!error) return null
  return (
    <Alert variant="danger" className="d-flex justify-content-between align-items-center gap-3">
      <span>{error.message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>Reintentar</button>
      )}
    </Alert>
  )
}

export function Empty({ children }) {
  return <div className="tf-empty">{children}</div>
}

// Paginación basada en { pagina, totalPaginas } (índice base 0).
export function Pager({ pagina, totalPaginas, onChange }) {
  if (!totalPaginas || totalPaginas <= 1) return null
  const items = Array.from({ length: totalPaginas }, (_, i) => (
    <Pagination.Item key={i} active={i === pagina} onClick={() => onChange(i)}>
      {i + 1}
    </Pagination.Item>
  ))
  return (
    <Pagination className="mt-4 flex-wrap">
      <Pagination.Prev disabled={pagina === 0} onClick={() => onChange(pagina - 1)} />
      {items}
      <Pagination.Next disabled={pagina >= totalPaginas - 1} onClick={() => onChange(pagina + 1)} />
    </Pagination>
  )
}
