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
import StudentList from "./components/StudentList"
import AddStudentPage from "./components/AddStudentPage"
import UpdateStudentPage from "./components/UpdateStudentPage"
import AssignmentList from "./components/AssignmentList"
import CreateAssignment from "./components/CreateAssignment"
import UserManagement from "./components/UserManagement"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
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

              {/* Student Management (Admin only) */}
              <Route path="/students" element={<StudentList />} />
              <Route path="/add-student" element={<AddStudentPage />} />
              <Route path="/update-student/:id" element={<UpdateStudentPage />} />

              {/* User Management (Admin only) */}
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App