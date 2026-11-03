import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { imgUrl } from '../api/client'
import { imagenesApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { Empty, ErrorBox, Loading, Pager } from '../components/Status'
import FileField from '../components/FileField'

export default function Gallery() {
  const { isStaff } = useAuth()
  const [page, setPage] = useState(0)
  const [selId, setSelId] = useState(null)
  const { data, error, loading, reload } = useFetch(() => imagenesApi.listar({ page, size: 24, sort: 'id,desc' }), [page])

  return (
    <>
      <h1 className="mb-4">Galería</h1>
      {isStaff && <Uploader onDone={() => { setPage(0); reload() }} />}

      <ErrorBox error={error} onRetry={reload} />
      {loading && <Loading />}
      {!loading && !error && !data?.contenido?.length && <Empty>Aún no hay imágenes registradas.</Empty>}

      <div className="tf-gallery">
        {data?.contenido?.map((img) => (
          <figure key={img.id} className="tf-thumb m-0">
            <button className="tf-thumb-open" onClick={() => setSelId(img.id)} aria-label={`Ver detalle de imagen ${img.id}`}>
              <img src={imgUrl(img.url)} alt="" loading="lazy" />
            </button>
            <figcaption className="tf-thumb-bar">
              <span>#{img.id}</span>
              <span>{img.duenos?.length ? `${img.duenos.length} uso(s)` : 'Sin dueño'}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Pager pagina={data?.pagina ?? 0} totalPaginas={data?.totalPaginas} onChange={setPage} />
      <ImageDetail id={selId} onHide={() => setSelId(null)} />
    </>
  )
}

function Uploader({ onDone }) {
  const [file, setFile] = useState(null)
  const [tipo, setTipo] = useState('general')
  const [key, setKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const img = await (tipo === 'producto' ? imagenesApi.subirProducto(file) : imagenesApi.subir(file))
      setMsg({ variant: 'success', text: `Imagen subida con id ${img.id}. Asígnala a un blog con ese id.` })
      setFile(null)
      setKey((k) => k + 1)
      onDone()
    } catch (err) {
      setMsg({ variant: 'danger', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} className="tf-panel mb-4">
      <h3 className="mb-3">Subir imagen</h3>
      {msg && <Alert variant={msg.variant}>{msg.text}</Alert>}
      <div className="row g-3 align-items-end">
        <div className="col-md-6"><FileField onChange={setFile} inputKey={key} /></div>
        <div className="col-md-3">
          <Form.Label>Carpeta</Form.Label>
          <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="general">General</option>
            <option value="producto">Productos</option>
          </Form.Select>
        </div>
        <div className="col-md-3"><Button type="submit" className="w-100" disabled={!file || busy}>Subir</Button></div>
      </div>
    </Form>
  )
}

function ImageDetail({ id, onHide }) {
  const { data, error, loading } = useFetch(() => (id ? imagenesApi.porId(id) : Promise.resolve(null)), [id])
  return (
    <Modal show={Boolean(id)} onHide={onHide} size="lg" centered>
      <Modal.Body>
        {loading && <Loading />}
        <ErrorBox error={error} />
        {data && (
          <>
            <img src={imgUrl(data.url)} alt="" className="w-100 rounded mb-3" />
            <p className="mb-1"><strong>Imagen #{data.id}</strong></p>
            <p className="tf-meta mb-2">{data.url}</p>
            {data.duenos?.length ? (
              <ul className="mb-0">
                {data.duenos.map((d) => <li key={`${d.tipo}-${d.id}`}>{d.tipo} #{d.id}</li>)}
              </ul>
            ) : <p className="mb-0 tf-meta">No pertenece a ningún blog ni producto todavía.</p>}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}
