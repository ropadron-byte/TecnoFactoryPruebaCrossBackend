import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { usuariosApi } from '../api/services'
import { ErrorBox, Loading } from '../components/Status'
import UserCard from '../components/UserCard'

export default function Users() {
  const [id, setId] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const buscar = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setUser(null)
    try {
      setUser(await usuariosApi.porId(id))
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="tf-form">
      <h1 className="mb-4">Buscar usuario</h1>
      <Form onSubmit={buscar} className="d-flex gap-2 mb-4">
        <Form.Control type="number" min="1" required placeholder="Id del usuario" aria-label="Id del usuario" value={id} onChange={(e) => setId(e.target.value)} />
        <Button type="submit" disabled={busy}>Buscar</Button>
      </Form>
      {busy && <Loading />}
      <ErrorBox error={error} />
      {user && <UserCard u={user} />}
    </div>
  )
}
