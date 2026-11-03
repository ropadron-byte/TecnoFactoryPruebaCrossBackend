import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/services'
import { clearSession, getSession, saveSession } from '../api/client'

const AuthContext = createContext(null)

// El backend puede devolver "ADMINISTRADOR" o "ROLE_ADMINISTRADOR": se normaliza.
const normalizeRole = (rol) => String(rol || '').toUpperCase().replace(/^ROLE_/, '')

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession())

  const login = useCallback(async (correo, clave) => {
    const data = await authApi.login(correo, clave)
    saveSession(data)
    setSession(data)
    return data
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  // Un 401 con sesión activa significa token vencido.
  useEffect(() => {
    window.addEventListener('tf:unauthorized', logout)
    return () => window.removeEventListener('tf:unauthorized', logout)
  }, [logout])

  const value = useMemo(() => {
    const rol = normalizeRole(session?.rol)
    return {
      session,
      rol,
      isAuth: Boolean(session?.token),
      isAdmin: rol === 'ADMINISTRADOR',
      isStaff: rol === 'ADMINISTRADOR' || rol === 'VENDEDOR',
      login,
      logout,
    }
  }, [session, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
