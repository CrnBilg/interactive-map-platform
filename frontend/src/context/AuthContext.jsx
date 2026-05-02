import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('citylore_token')
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('citylore_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('citylore_token', data.token)
    setUser(data)
    return data
  }

  const register = async (username, email, password) => {
    const { data } = await authAPI.register({ username, email, password })
    localStorage.setItem('citylore_token', data.token)
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('citylore_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
