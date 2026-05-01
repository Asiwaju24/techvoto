import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api' // Use your configured instance

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Initial Load: Check if we're already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('tv-token')
      if (token) {
        try {
          // Set the header manually for the very first check
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const r = await api.get('/auth/me/')
          setUser(r.data)
        } catch (err) {
          console.error("Session expired or invalid")
          localStorage.removeItem('tv-token')
          localStorage.removeItem('tv-refresh')
          delete api.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }
    initializeAuth()
  }, [])

  // 2. Login: The core fix
  const login = async (email, password) => {
    // We use 'api' so the baseURL '/api' is automatically prepended
    const { data } = await api.post('/auth/login/', { email, password })
    
    localStorage.setItem('tv-token', data.access)
    localStorage.setItem('tv-refresh', data.refresh)
    
    // Update the instance headers immediately so subsequent 
    // redirects (like to the Dashboard) are authorized
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
    
    setUser(data.user)
    return data
  }

  // 3. Signup
  const signup = async (payload) => {
    const { data } = await api.post('/auth/register/', payload)
    localStorage.setItem('tv-token', data.access)
    localStorage.setItem('tv-refresh', data.refresh)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
    setUser(data.user)
    return data
  }

  // 4. Logout
  const logout = () => {
    localStorage.removeItem('tv-token')
    localStorage.removeItem('tv-refresh')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)