import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, Form, Button, Alert } from "react-bootstrap"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("🔐 Login attempt:", { username, password: "***" })

    const result = await login(username, password)

    console.log("🔐 Login result:", result)

    if (result.success) {
      console.log("✅ Login successful, navigating to dashboard...")
      navigate("/dashboard")
    } else {
      console.error("❌ Login failed:", result.error)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-2">Assignment Management System</h2>
          <h5 className="text-center text-muted mb-4">Login</h5>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <Alert variant="light" className="mb-0">
              <small>
                <strong>Students:</strong> Use credentials provided by your administrator
                <br />
                <strong>Need help?</strong> Contact your system administrator
              </small>
            </Alert>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login
