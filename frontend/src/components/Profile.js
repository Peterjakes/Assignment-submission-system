import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap"

const Profile = () => {
  const { user } = useAuth()
  const [lastLogin, setLastLogin] = useState(null)

  useEffect(() => {
    //  we'll use the user data from context
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
              <Card.Title>User Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header>Account Information</Card.Header>
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
                  <Card>
                    <Card.Header>Security & Actions</Card.Header>
                    <Card.Body>
                      <div className="d-grid gap-3">
                        <Link to="/change-password" className="btn btn-primary">
                          Change Password
                        </Link>
                        <div className="text-center">
                          <small className="text-muted">Last login: {formatDate(user?.lastLogin)}</small>
                        </div>
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