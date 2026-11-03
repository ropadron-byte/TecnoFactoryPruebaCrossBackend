import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { isAuth, isStaff, isAdmin, session, rol, logout } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="tf-nav" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="tf-brand">
          <span className="tf-mark">T</span>TecnoFactory
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu" />
        <Navbar.Collapse id="menu">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/galeria">Galería</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            {isStaff && <Nav.Link as={NavLink} to="/blogs/nuevo">Nuevo blog</Nav.Link>}
            {isStaff && <Nav.Link as={NavLink} to="/mensajes">Mensajes</Nav.Link>}
            {isAdmin && <Nav.Link as={NavLink} to="/usuarios">Usuarios</Nav.Link>}
          </Nav>
          <Nav className="align-items-lg-center gap-lg-2">
            {isAuth ? (
              <>
                <Nav.Link as={NavLink} to="/perfil">
                  {session.correo} <span className="tf-role">{rol.toLowerCase()}</span>
                </Nav.Link>
                <button className="btn btn-sm btn-outline-light" onClick={salir}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/ingresar">Ingresar</Nav.Link>
                <NavLink to="/registro" className="btn btn-sm btn-accent">Crear cuenta</NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
