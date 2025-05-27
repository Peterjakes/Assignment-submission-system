"use client"

import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap"

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/dashboard">
            Assignment System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/assignments">
                Assignments
              </Nav.Link>

              {user?.role === "admin" ? (
                <>
                  <NavDropdown title="Manage" id="admin-dropdown">
                    <NavDropdown.Item as={NavLink} to="/create-assignment">
                      Create Assignment
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} to="/students">
                      View Students
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/add-student">
                      Add Student
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} to="/user-management">
                      User Management
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={NavLink} to="/my-submissions">
                  My Submissions
                </Nav.Link>
              )}
            </Nav>

            {/* User Profile Dropdown */}
            <NavDropdown title={`${user?.fullName} (${user?.role})`} id="user-dropdown" className="me-2">
              <NavDropdown.Item as={NavLink} to="/profile">
                👤 View Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/change-password">
                🔐 Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>🚪 Logout</NavDropdown.Item>
            </NavDropdown>

            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 py-4">
        <Outlet />
      </Container>

      <footer className="bg-light py-3 text-center">
        <Container>
          <p className="text-muted mb-0">Assignment Submission System &copy; {new Date().getFullYear()}</p>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
