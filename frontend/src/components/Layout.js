import { Outlet, NavLink } from "react-router-dom"
import { Navbar, Container, Nav } from "react-bootstrap"

const Layout = () => {
  return (
    <div>
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

export default Layout