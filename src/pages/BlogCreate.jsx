import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { blogsApi, imagenesApi } from '../api/services'
import FileField from '../components/FileField'

export default function BlogCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ titulo: '', contenido: '', visible: true })
  const [portada, setPortada] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      // 1) se sube la portada (queda sin dueño), 2) se crea el blog con su id.
      const body = { ...form }
      if (portada) body.idImagenPrincipal = (await imagenesApi.subir(portada)).id
      const blog = await blogsApi.crear(body)
      navigate(`/blogs/${blog.id}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} className="tf-form">
      <h1 className="mb-4">Nuevo blog</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control required maxLength={255} value={form.titulo} onChange={set('titulo')} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contenido ({form.contenido.length}/16000)</Form.Label>
        <Form.Control as="textarea" rows={12} required maxLength={16000} value={form.contenido} onChange={set('contenido')} />
      </Form.Group>
      <div className="mb-3"><FileField label="Portada (opcional)" onChange={setPortada} /></div>
      <Form.Check
        className="mb-4"
        type="switch"
        id="visible"
        label="Publicar ahora (visible para el público)"
        checked={form.visible}
        onChange={set('visible')}
      />
      <Button type="submit" disabled={busy}>{busy ? 'Publicando…' : 'Crear blog'}</Button>
    </Form>
  )
}
