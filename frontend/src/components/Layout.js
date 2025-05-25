import { Outlet } from "react-router-dom"
import { Navbar, Container } from "react-bootstrap"

const Layout = () => {
  return (
    <div>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Assignment System</Navbar.Brand>
        </Container>
      </Navbar>
      
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

export default Layout