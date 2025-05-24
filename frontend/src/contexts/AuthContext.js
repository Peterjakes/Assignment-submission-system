import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing auth on startup
  useEffect(() => {
    const initAuth = () => {
      const token = sessionStorage.getItem('token')
      const userData = sessionStorage.getItem('user')
      
      if (token && userData) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        } catch (error) {
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('user')
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })
      
      const { user, accessToken } = response.data
      
      sessionStorage.setItem('token', accessToken)
      sessionStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.post('http://localhost:5000/api/auth/register', userData)
      
      const { user, accessToken } = response.data
      
      // Same logic as login - store token and authenticate
      sessionStorage.setItem('token', accessToken)
      sessionStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      error,
      login,
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}