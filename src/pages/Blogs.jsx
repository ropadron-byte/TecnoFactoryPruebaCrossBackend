import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { blogsApi } from '../api/services'
import { useFetch } from '../hooks/useFetch'
import { Empty, ErrorBox, Loading, Pager } from '../components/Status'
import Cover, { fmtDate } from '../components/Cover'

const SIZE = 9

export default function Blogs() {
  const [page, setPage] = useState(0)
  const { data, error, loading, reload } = useFetch(
    () => blogsApi.listar({ page, size: SIZE, sort: 'fechaCreacion,desc' }),
    [page],
  )

  const items = data?.contenido ?? []
  const [lead, ...rest] = page === 0 ? items : [null, ...items]

  return (
    <>
      <header className="mb-4">
        <h1>Novedades de TecnoFactory</h1>
        <p className="tf-meta fs-6 mb-0">Guías, lanzamientos y consejos del equipo de la tienda.</p>
      </header>

      <ErrorBox error={error} onRetry={reload} />
      {loading && <Loading />}
      {!loading && !error && items.length === 0 && <Empty>Todavía no hay publicaciones.</Empty>}

      {lead && (
        <Link to={`/blogs/${lead.id}`} className="tf-lead mb-5">
          <Cover imagen={lead.imagenPrincipal} alt={lead.titulo} />
          <div className="tf-lead-body">
            <span className="tf-meta">{fmtDate(lead.fechaCreacion)} · {lead.autorNombre}</span>
            <h2>{lead.titulo}</h2>
          </div>
        </Link>
      )}

      <Row className="g-4">
        {rest.filter(Boolean).map((b) => (
          <Col key={b.id} xs={12} md={6} lg={4}>
            <Link to={`/blogs/${b.id}`} className="tf-post">
              <Cover imagen={b.imagenPrincipal} alt={b.titulo} />
              <h3>{b.titulo}</h3>
              <span className="tf-meta">{fmtDate(b.fechaCreacion)} · {b.autorNombre}</span>
            </Link>
          </Col>
        ))}
      </Row>

      <Pager pagina={data?.pagina ?? 0} totalPaginas={data?.totalPaginas} onChange={setPage} />
    </>
  )
}
