import { request } from './client'

const paging = ({ page = 0, size = 20, sort } = {}) => ({ page, size, sort })
const fileForm = (archivo) => {
  const f = new FormData()
  f.append('archivo', archivo)
  return f
}

export const authApi = {
  login: (correo, clave) =>
    request('/api/auth/login', { method: 'POST', body: { correo, clave }, auth: false }),
}

export const usuariosApi = {
  registrar: (data) => request('/api/usuarios', { method: 'POST', body: data, auth: false }),
  me: () => request('/api/usuarios/me'),
  porId: (id) => request(`/api/usuarios/${id}`),
}

export const contactosApi = {
  enviar: (data) => request('/api/contactos', { method: 'POST', body: data, auth: false }),
  listar: (p) => request('/api/contactos', { params: paging(p) }),
  porId: (id) => request(`/api/contactos/${id}`),
}

export const imagenesApi = {
  listar: (p) => request('/api/imagenes', { params: paging(p), auth: false }),
  porId: (id) => request(`/api/imagenes/${id}`, { auth: false }),
  subir: (archivo) => request('/api/imagenes', { method: 'POST', form: fileForm(archivo) }),
  subirProducto: (archivo) =>
    request('/api/imagenes/productos', { method: 'POST', form: fileForm(archivo) }),
}

export const blogsApi = {
  listar: (p) => request('/api/blogs', { params: paging(p), auth: false }),
  porId: (id) => request(`/api/blogs/${id}`, { auth: false }),
  crear: (data) => request('/api/blogs', { method: 'POST', body: data }),
  galeria: (id) => request(`/api/blogs/${id}/imagenes`, { auth: false }),
  subirAGaleria: (id, archivo) =>
    request(`/api/blogs/${id}/imagenes`, { method: 'POST', form: fileForm(archivo) }),
  agregarAGaleria: (id, idImagen) =>
    request(`/api/blogs/${id}/imagenes/${idImagen}`, { method: 'POST' }),
  portada: (id) => request(`/api/blogs/${id}/imagen`, { auth: false }),
  cambiarPortada: (id, idImagen) =>
    request(`/api/blogs/${id}/imagen-principal/${idImagen}`, { method: 'PUT' }),
}
