import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { imgUrl } from '../api/client'
import { blogsApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { ErrorBox, Loading } from '../components/Status'
import Cover, { fmtDate } from '../components/Cover'
import FileField from '../components/FileField'

export default function BlogDetail() {
  const { id } = useParams()
  const { isStaff } = useAuth()
  const { data: blog, error, loading, reload } = useFetch(() => blogsApi.porId(id), [id])
  const [zoom, setZoom] = useState(null)

  if (loading) return <Loading />
  if (error) return <ErrorBox error={error} onRetry={reload} />

  const galeria = blog.imagenes ?? []

  return (
    <article>
      <Link to="/" className="tf-meta">← Volver al blog</Link>
      <h1 className="mt-3 mb-2">{blog.titulo}</h1>
      <p className="tf-meta mb-4">
        {fmtDate(blog.fechaCreacion)} · por {blog.autorNombre}
        {isStaff && !blog.visible && <span className="badge text-bg-warning ms-2">Oculto</span>}
      </p>

      {blog.imagenPrincipal && (
        <Cover imagen={blog.imagenPrincipal} alt={blog.titulo} className="mb-4 rounded" />
      )}

      <div className="tf-article mb-5">{blog.contenido}</div>

      {(galeria.length > 0 || isStaff) && (
        <section aria-labelledby="gal">
          <h2 id="gal" className="mb-3">Galería</h2>
          {galeria.length === 0 && <p className="tf-meta">Este blog aún no tiene imágenes en su galería.</p>}
          <div className="tf-gallery">
            {galeria.map((img) => {
              const esPortada = blog.imagenPrincipal?.id === img.id
              return (
                <figure key={img.id} className="tf-thumb m-0">
                  {esPortada && <span className="tf-badge-cover">Portada</span>}
                  <button className="tf-thumb-open" onClick={() => setZoom(img)} aria-label={`Ampliar imagen ${img.id}`}>
                    <img src={imgUrl(img.url)} alt="" loading="lazy" />
                  </button>
                  <figcaption className="tf-thumb-bar">
                    <span>#{img.id}</span>
                    {isStaff && !esPortada && <SetCover blogId={blog.id} imagenId={img.id} onDone={reload} />}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </section>
      )}

      {isStaff && <StaffTools blogId={blog.id} onDone={reload} />}

      <Modal show={Boolean(zoom)} onHide={() => setZoom(null)} size="lg" centered>
        <Modal.Body className="p-0">
          {zoom && <img src={imgUrl(zoom.url)} alt="" className="w-100 d-block" />}
        </Modal.Body>
      </Modal>
    </article>
  )
}

function SetCover({ blogId, imagenId, onDone }) {
  const [busy, setBusy] = useState(false)
  const click = async () => {
    setBusy(true)
    try {
      await blogsApi.cambiarPortada(blogId, imagenId)
      onDone()
    } catch (e) {
      alert(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <button className="btn btn-link btn-sm p-0" onClick={click} disabled={busy}>
      Usar de portada
    </button>
  )
}

// Herramientas para ADMINISTRADOR / VENDEDOR: subir o asociar imágenes a la galería.
function StaffTools({ blogId, onDone }) {
  const [file, setFile] = useState(null)
  const [existente, setExistente] = useState('')
  const [fileKey, setFileKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const run = async (fn, okText) => {
    setBusy(true)
    setMsg(null)
    try {
      await fn()
      setMsg({ variant: 'success', text: okText })
      onDone()
    } catch (e) {
      setMsg({ variant: 'danger', text: e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="tf-panel mt-5" aria-label="Herramientas de edición">
      <h3 className="mb-3">Administrar galería</h3>
      {msg && <Alert variant={msg.variant}>{msg.text}</Alert>}
      <div className="row g-4">
        <Form
          className="col-md-6"
          onSubmit={(e) => {
            e.preventDefault()
            run(async () => {
              await blogsApi.subirAGaleria(blogId, file)
              setFile(null)
              setFileKey((k) => k + 1)
            }, 'Imagen subida a la galería.')
          }}
        >
          <FileField label="Subir una imagen nueva" onChange={setFile} inputKey={fileKey} />
          <Button type="submit" className="mt-2" disabled={!file || busy}>Subir a la galería</Button>
        </Form>
        <Form
          className="col-md-6"
          onSubmit={(e) => {
            e.preventDefault()
            run(async () => {
              await blogsApi.agregarAGaleria(blogId, existente)
              setExistente('')
            }, 'Imagen agregada a la galería.')
          }}
        >
          <Form.Group>
            <Form.Label>Agregar una imagen que ya existe (id)</Form.Label>
            <Form.Control type="number" min="1" value={existente} onChange={(e) => setExistente(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="outline-dark" className="mt-2" disabled={!existente || busy}>
            Agregar por id
          </Button>
        </Form>
      </div>
    </section>
  )
}
