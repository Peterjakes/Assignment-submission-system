import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap"

const Profile = () => {
  const { user } = useAuth()
  const [lastLogin, setLastLogin] = useState(null)

  useEffect(() => {
    // You could fetch additional user details here if needed
    // For now, we'll use the user data from context
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="container-fluid">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">👤 User Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>
                      <strong>📋 Account Information</strong>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Full Name:</strong>
                          <span>{user?.fullName}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Username:</strong>
                          <span>{user?.username}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Email:</strong>
                          <span>{user?.email}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Role:</strong>
                          <Badge bg={user?.role === "admin" ? "danger" : "primary"}>{user?.role}</Badge>
                        </ListGroup.Item>
                        {user?.studentId && (
                          <ListGroup.Item className="d-flex justify-content-between">
                            <strong>Student ID:</strong>
                            <span>{user?.studentId}</span>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>
                      <strong>🔐 Security & Actions</strong>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-grid gap-3">
                        <Link to="/change-password" className="btn btn-primary">
                          🔐 Change Password
                        </Link>

                        <div className="text-center">
                          <small className="text-muted">Last login: {formatDate(user?.lastLogin)}</small>
                        </div>

                        {user?.role === "student" && (
                          <div className="alert alert-info">
                            <strong>💡 Student Tips:</strong>
                            <ul className="mb-0 mt-2">
                              <li>Change your password regularly</li>
                              <li>Keep your login credentials secure</li>
                              <li>Contact admin if you forget your password</li>
                            </ul>
                          </div>
                        )}

                        {user?.role === "admin" && (
                          <div className="alert alert-warning">
                            <strong>⚠️ Admin Responsibilities:</strong>
                            <ul className="mb-0 mt-2">
                              <li>Manage student accounts securely</li>
                              <li>Use strong passwords</li>
                              <li>Monitor system activity</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile