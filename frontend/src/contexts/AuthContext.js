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

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

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

  // Handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.post(`${API_URL}/auth/login`, {
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
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      
      const { user, accessToken } = response.data
      
      sessionStorage.setItem('token', accessToken)
      sessionStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
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