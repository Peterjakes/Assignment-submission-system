import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import AssignmentList from "./components/AssignmentList"
import CreateAssignment from "./components/CreateAssignment"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard - Overview page */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Assignment Management */}
              <Route path="/assignments" element={<AssignmentList />} />
              <Route path="/create-assignment" element={<CreateAssignment />} />
            </Route>
          </Route>

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App