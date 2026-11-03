import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { contactosApi } from '../api/services'

const empty = { nombre: '', correo: '', comentario: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      await contactosApi.enviar(form)
      setMsg({ variant: 'success', text: 'Recibimos tu mensaje. Te responderemos al correo que indicaste.' })
      setForm(empty)
    } catch (err) {
      setMsg({ variant: 'danger', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} className="tf-form">
      <h1 className="mb-2">Escríbenos</h1>
      <p className="tf-meta mb-4">No necesitas una cuenta para contactarnos.</p>
      {msg && <Alert variant={msg.variant}>{msg.text}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control required maxLength={100} value={form.nombre} onChange={set('nombre')} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Correo</Form.Label>
        <Form.Control type="email" required maxLength={250} value={form.correo} onChange={set('correo')} />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Mensaje ({form.comentario.length}/500)</Form.Label>
        <Form.Control as="textarea" rows={5} required maxLength={500} value={form.comentario} onChange={set('comentario')} />
      </Form.Group>
      <Button type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Enviar mensaje'}</Button>
    </Form>
  )
}
