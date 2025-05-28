import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import Profile from "./components/Profile"
import ChangePassword from "./components/ChangePassword"
import StudentList from "./components/StudentList"
import AddStudentPage from "./components/AddStudentPage"
import UpdateStudentPage from "./components/UpdateStudentPage"
import AssignmentList from "./components/AssignmentList"
import CreateAssignment from "./components/CreateAssignment"
import UserManagement from "./components/UserManagement"
import AssignmentDetail from "./components/AssignmentDetail"
import SubmissionList from "./components/SubmissionList"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard - Overview page */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* User Profile & Security */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />

              {/* Assignment Management */}
              <Route path="/assignments" element={<AssignmentList />} />
              <Route path="/create-assignment" element={<CreateAssignment />} />

              {/* Assignment Detail & Submission */}
              <Route path="/assignments/:id" element={<AssignmentDetail />} />
              <Route path="/assignments/:assignmentId/submissions" element={<SubmissionList />} />

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
