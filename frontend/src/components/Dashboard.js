import { useAuth } from "../contexts/AuthContext"
import { Card, Row, Col } from "react-bootstrap"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3>Welcome back!</h3>
              <p>Hello, {user?.fullName}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard