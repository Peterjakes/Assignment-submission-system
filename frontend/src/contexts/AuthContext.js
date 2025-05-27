import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

// Create the AuthContext
export const AuthContext = createContext()

// Custom hook for easier context consumption
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  // Function to set auth headers
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      console.log("🔧 Auth header set:", `Bearer ${token.substring(0, 20)}...`)
    } else {
      delete axios.defaults.headers.common["Authorization"]
      console.log("🔧 Auth header removed")
    }
  }

  // Check for existing token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔍 Checking authentication...") // Debug log

      const token = sessionStorage.getItem("token")
      const userData = sessionStorage.getItem("user")

      console.log("🎫 Token found:", token ? "Yes" : "No") // Debug log
      console.log("👤 User data found:", userData ? "Yes" : "No") // Debug log

      if (token && userData) {
        try {
          // Set auth header FIRST
          setAuthHeader(token)

          // Parse and set user data
          const user = JSON.parse(userData)
          setUser(user)
          setIsAuthenticated(true)

          console.log("✅ Authentication restored for:", user.username) // Debug log
        } catch (err) {
          console.error("❌ Error restoring auth:", err)
          // Clear invalid data
          sessionStorage.removeItem("token")
          sessionStorage.removeItem("user")
          setAuthHeader(null)
        }
      } else {
        console.log("❌ No valid authentication found") // Debug log
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔐 Attempting login...") // Debug log

      const response = await axios.post(`${API_URL}/auth/login`, {
        email: username, // Backend expects email field
        password,
      })

      console.log("✅ Login response:", response.data) // Debug log

      const { accessToken, user } = response.data

      if (accessToken) {
        // Clear any existing data first
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        setAuthHeader(null)

        // Set new data
        sessionStorage.setItem("token", accessToken)
        sessionStorage.setItem("user", JSON.stringify(user))

        // Set auth header IMMEDIATELY and SYNCHRONOUSLY
        setAuthHeader(accessToken)

        console.log("💾 Token stored and header set") // Debug log
        console.log("👤 User stored:", user) // Debug log

        // Update state AFTER everything is set
        setUser(user)
        setIsAuthenticated(true)

        // Add a small delay to ensure everything is properly set
        await new Promise(resolve => setTimeout(resolve, 50))

        return { success: true }
      } else {
        console.error("❌ No token received in response")
        setError("Login failed: No token received")
        return { success: false, error: "No token received" }
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message)
      const errorMessage = err.response?.data?.error?.message || "Invalid username or password."
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log("🚪 Logging out...")
    // Clear token from storage
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")

    // Remove auth header
    setAuthHeader(null)

    // Update state
    setUser(null)
    setIsAuthenticated(false)
  }

  // Create axios interceptor to handle 401 errors (token expired)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("🚫 401 Unauthorized - token may be expired")
          // Only logout if we were previously authenticated
          if (isAuthenticated) {
            console.log("🚪 Auto-logout due to 401")
            logout()
          }
        }
        return Promise.reject(error)
      },
    )

    // Clean up interceptor on unmount
    return () => axios.interceptors.response.eject(interceptor)
  }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}