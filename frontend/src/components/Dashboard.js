import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { Card, Row, Col, Button } from "react-bootstrap"

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
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token")
        const assignmentsRes = await axios.get(`${API_URL}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (user.role === "admin") {
          const studentsRes = await axios.get(`${API_URL}/users/students`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          setStats({
            assignments: assignmentsRes.data.length,
            students: studentsRes.data.length,
            submissions: 0,
          })
        } else {
          setStats({
            assignments: assignmentsRes.data.filter(a => a.published).length,
            submissions: 0,
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, API_URL])

  if (loading) return <div className="d-flex justify-content-center p-5">Loading dashboard...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        {user.role === "admin" && (
          <div className="d-flex gap-2">
            <Link to="/create-assignment">
              <Button variant="primary">Create Assignment</Button>
            </Link>
            <Link to="/add-student">
              <Button variant="success">Add Student</Button>
            </Link>
          </div>
        )}
      </div>

      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100 border-primary">
            <Card.Body>
              <h3 className="h5 text-muted">Assignments</h3>
              <h2 className="display-4 text-primary">{stats.assignments}</h2>
              <Link to="/assignments" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {user.role === "admin" && (
          <Col md={3} sm={6} className="mb-3">
            <Card className="text-center h-100 border-success">
              <Card.Body>
                <h3 className="h5 text-muted">Students</h3>
                <h2 className="display-4 text-success">{stats.students}</h2>
                <Link to="/students" className="btn btn-outline-success btn-sm">
                  Manage Students
                </Link>
              </Card.Body>
            </Card>
          </Col>
        )}

        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100 border-info">
            <Card.Body>
              <h3 className="h5 text-muted">Submissions</h3>
              <h2 className="display-4 text-info">{stats.submissions}</h2>
              <Link to="/assignments" className="btn btn-outline-info btn-sm">
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard