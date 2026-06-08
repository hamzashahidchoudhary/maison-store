import { createContext, useContext, useState } from 'react'
import { authAPI } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('maison_user')
    return saved ? JSON.parse(saved) : null
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const saveUser = (user, token) => {
    setUser(user)
    localStorage.setItem('maison_user', JSON.stringify(user))
    localStorage.setItem('maison_token', token)
  }

  const register = async ({ name, email, password }) => {
    setLoading(true)
    setError('')
    try {
      const data = await authAPI.register({ name, email, password })
      saveUser(data.user, data.token)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    setLoading(true)
    setError('')
    try {
      const data = await authAPI.login({ email, password })
      saveUser(data.user, data.token)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('maison_user')
    localStorage.removeItem('maison_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error, loading, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
