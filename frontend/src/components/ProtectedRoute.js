import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render children if authenticated
  return <Outlet />
}

export default ProtectedRoute