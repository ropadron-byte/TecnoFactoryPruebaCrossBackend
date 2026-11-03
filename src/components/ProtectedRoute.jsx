import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ staff = false, admin = false }) {
  const { isAuth, isStaff, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuth) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />
  if ((admin && !isAdmin) || (staff && !isStaff)) {
    return <Alert variant="warning">Esta sección es solo para {admin ? 'administradores' : 'personal de la tienda'}.</Alert>
  }
  return <Outlet />
}
