import { useState } from 'react'
import { Modal, Table } from 'react-bootstrap'
import { contactosApi } from '../api/services'
import { useFetch } from '../hooks/useFetch'
import { Empty, ErrorBox, Loading, Pager } from '../components/Status'

export default function Messages() {
  const [page, setPage] = useState(0)
  const [selId, setSelId] = useState(null)
  const { data, error, loading, reload } = useFetch(() => contactosApi.listar({ page, size: 15, sort: 'id,desc' }), [page])
  const detail = useFetch(() => (selId ? contactosApi.porId(selId) : Promise.resolve(null)), [selId])

  return (
    <>
      <h1 className="mb-4">Mensajes de contacto</h1>
      <ErrorBox error={error} onRetry={reload} />
      {loading && <Loading />}
      {!loading && !error && !data?.contenido?.length && <Empty>No hay mensajes todavía.</Empty>}

      {data?.contenido?.length > 0 && (
        <div className="table-responsive">
          <Table hover className="align-middle bg-white">
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Correo</th><th>Mensaje</th><th /></tr>
            </thead>
            <tbody>
              {data.contenido.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td><a href={`mailto:${c.correo}`}>{c.correo}</a></td>
                  <td className="text-truncate" style={{ maxWidth: 320 }}>{c.comentario}</td>
                  <td className="text-end">
                    <button className="btn btn-link btn-sm" onClick={() => setSelId(c.id)}>Abrir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Pager pagina={data?.pagina ?? 0} totalPaginas={data?.totalPaginas} onChange={setPage} />
      {data && <p className="tf-meta">{data.totalElementos} mensaje(s) en total</p>}

      <Modal show={Boolean(selId)} onHide={() => setSelId(null)} centered>
        <Modal.Header closeButton><Modal.Title as="h3">Mensaje #{selId}</Modal.Title></Modal.Header>
        <Modal.Body>
          {detail.loading && <Loading />}
          <ErrorBox error={detail.error} />
          {detail.data && (
            <>
              <p className="mb-1"><strong>{detail.data.nombre}</strong></p>
              <p><a href={`mailto:${detail.data.correo}`}>{detail.data.correo}</a></p>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{detail.data.comentario}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
