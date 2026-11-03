import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import BlogCreate from './pages/BlogCreate'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Messages from './pages/Messages'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Users from './pages/Users'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container py-4 py-md-5">
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/ingresar" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute staff />}>
            <Route path="/blogs/nuevo" element={<BlogCreate />} />
            <Route path="/mensajes" element={<Messages />} />
          </Route>
          <Route element={<ProtectedRoute admin />}>
            <Route path="/usuarios" element={<Users />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="tf-footer">
        <div className="container">TecnoFactory · Tienda de tecnología</div>
      </footer>
    </>
  )
}
