import { createContext, useContext, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })
      
      const { user } = response.data
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

  const logout = () => {
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
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}