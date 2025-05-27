import { useAuth } from "../contexts/AuthContext"
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap"

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="container-fluid">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <Card.Title>User Profile</Card.Title>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Profile