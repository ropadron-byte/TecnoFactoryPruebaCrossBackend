import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(correo, clave)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <Form onSubmit={submit} className="tf-narrow">
      <h1 className="mb-4">Ingresar</h1>
      {location.state?.registrado && <Alert variant="success">Cuenta creada. Ya puedes ingresar.</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Correo</Form.Label>
        <Form.Control type="email" required autoComplete="username" maxLength={255} value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" required autoComplete="current-password" maxLength={72} value={clave} onChange={(e) => setClave(e.target.value)} />
      </Form.Group>
      <Button type="submit" className="w-100" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</Button>
      <p className="mt-3 tf-meta">¿No tienes cuenta? <Link to="/registro">Créala aquí</Link></p>
    </Form>
  )
}
