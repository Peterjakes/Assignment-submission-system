import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Card, Row, Col } from "react-bootstrap"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    assignments: 0,
    students: 0,
    submissions: 0,
  })
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    // TODO: Fetch dashboard data
    setLoading(false)
  }, [user])

  if (loading) return <div>Loading...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3>Assignments</h3>
              <h2>{stats.assignments}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard