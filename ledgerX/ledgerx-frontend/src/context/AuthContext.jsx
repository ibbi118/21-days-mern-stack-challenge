import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ledgerx_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('ledgerx_token')
      if (!token) { setLoading(false); return }
      try {
        const res = await authAPI.getMe()
        const userData = res.data.user || res.data
        setUser(userData)
        localStorage.setItem('ledgerx_user', JSON.stringify(userData))
      } catch {
        localStorage.removeItem('ledgerx_token')
        localStorage.removeItem('ledgerx_user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authAPI.login(credentials)
    const { token, user: userData } = res.data
    if (token) localStorage.setItem('ledgerx_token', token)
    const u = userData || res.data
    localStorage.setItem('ledgerx_user', JSON.stringify(u))
    setUser(u)
    return res.data
  }, [])

  const register = useCallback(async (credentials) => {
    const res = await authAPI.register(credentials)
    const { token, user: userData } = res.data
    if (token) localStorage.setItem('ledgerx_token', token)
    const u = userData || res.data
    localStorage.setItem('ledgerx_user', JSON.stringify(u))
    setUser(u)
    return res.data
  }, [])

  const logout = useCallback(async () => {
    try { await authAPI.logout() } catch {}
    localStorage.removeItem('ledgerx_token')
    localStorage.removeItem('ledgerx_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
