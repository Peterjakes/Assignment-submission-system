import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, Form, Button, Alert } from "react-bootstrap"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await login(email, password)

    if (result.success) {
      navigate("/dashboard")
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
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login