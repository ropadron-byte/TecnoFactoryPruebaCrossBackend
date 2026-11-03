// Cliente HTTP mínimo sobre fetch. Adjunta el JWT y normaliza los errores.
const BASE = import.meta.env.VITE_API_URL ?? ''
const SESSION_KEY = 'tf_session'

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}
export function saveSession(s) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}
export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

function buildMessage(status, data) {
  if (data && typeof data === 'object') {
    if (Array.isArray(data.errors) && data.errors.length) {
      return data.errors
        .map((e) => (typeof e === 'string' ? e : e.defaultMessage || e.message))
        .filter(Boolean)
        .join(' · ')
    }
    if (data.message) return data.message
    if (data.error) return data.error
    if (data.detail) return data.detail
  }
  if (typeof data === 'string' && data.trim()) return data
  if (status === 401) return 'Credenciales inválidas o sesión vencida.'
  if (status === 403) return 'No tienes permisos para realizar esta acción.'
  if (status === 404) return 'No se encontró lo que buscabas.'
  if (status === 0) return 'No se pudo conectar con el servidor.'
  return `Error ${status} al comunicarse con el servidor.`
}

export async function request(path, { method = 'GET', body, form, params, auth = true } = {}) {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const headers = { Accept: 'application/json' }
  const session = getSession()
  if (auth && session?.token) {
    headers.Authorization = `${session.tipo || 'Bearer'} ${session.token}`
  }

  let payload
  if (form) {
    payload = form // el navegador pone el boundary de multipart
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(url, { method, headers, body: payload })
  } catch {
    throw new ApiError(0, buildMessage(0))
  }

  if (res.status === 204) return null

  const text = await res.text()
  let data = text
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    /* respuesta no JSON */
  }

  if (!res.ok) {
    if (res.status === 401 && session) window.dispatchEvent(new Event('tf:unauthorized'))
    throw new ApiError(res.status, buildMessage(res.status, data), data)
  }
  return data
}

// Las URLs de imagen pueden venir relativas (/uploads/...) o absolutas.
export function imgUrl(url) {
  if (!url) return ''
  if (/^(https?:|data:)/i.test(url)) return url
  return `${BASE}${url.startsWith('/') ? url : `/${url}`}`
}
