import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { usuariosApi } from '../api/services'

const empty = {
  run: '', runDv: '', nombre: '', apellidos: '', correo: '', clave: '',
  fechaNacimiento: '', direccion: '', telefono: '', idComuna: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [f, setF] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await usuariosApi.registrar({ ...f, run: Number(f.run), idComuna: Number(f.idComuna) })
      navigate('/ingresar', { state: { registrado: true } })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} className="tf-form">
      <h1 className="mb-4">Crear cuenta</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="row g-3">
        <Form.Group className="col-8 col-md-5">
          <Form.Label>RUN (sin puntos ni dígito)</Form.Label>
          <Form.Control type="number" required min={1000000} max={99999999} value={f.run} onChange={set('run')} />
        </Form.Group>
        <Form.Group className="col-4 col-md-2">
          <Form.Label>Dígito</Form.Label>
          <Form.Control required maxLength={1} pattern="[0-9kK]" value={f.runDv} onChange={set('runDv')} />
        </Form.Group>
        <Form.Group className="col-md-6">
          <Form.Label>Nombre</Form.Label>
          <Form.Control required maxLength={255} value={f.nombre} onChange={set('nombre')} />
        </Form.Group>
        <Form.Group className="col-md-6">
          <Form.Label>Apellidos</Form.Label>
          <Form.Control required maxLength={255} value={f.apellidos} onChange={set('apellidos')} />
        </Form.Group>
        <Form.Group className="col-md-7">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" required maxLength={255} autoComplete="email" value={f.correo} onChange={set('correo')} />
        </Form.Group>
        <Form.Group className="col-md-5">
          <Form.Label>Contraseña (8 a 72 caracteres)</Form.Label>
          <Form.Control type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={f.clave} onChange={set('clave')} />
        </Form.Group>
        <Form.Group className="col-md-5">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control type="date" required value={f.fechaNacimiento} onChange={set('fechaNacimiento')} />
        </Form.Group>
        <Form.Group className="col-md-7">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control required pattern="\+?[0-9]{8,14}" placeholder="+56912345678" title="Entre 8 y 14 dígitos, con + opcional" value={f.telefono} onChange={set('telefono')} />
        </Form.Group>
        <Form.Group className="col-md-8">
          <Form.Label>Dirección</Form.Label>
          <Form.Control required maxLength={255} value={f.direccion} onChange={set('direccion')} />
        </Form.Group>
        <Form.Group className="col-md-4">
          <Form.Label>Id de comuna</Form.Label>
          <Form.Control type="number" required min={1} value={f.idComuna} onChange={set('idComuna')} />
        </Form.Group>
      </div>

      <Button type="submit" className="mt-4" disabled={busy}>{busy ? 'Creando…' : 'Crear cuenta'}</Button>
      <p className="mt-3 tf-meta">¿Ya tienes cuenta? <Link to="/ingresar">Ingresa</Link></p>
    </Form>
  )
}
