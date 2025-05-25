import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { Card, Row, Col, ListGroup, Badge, Button } from "react-bootstrap"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    assignments: 0,
    students: 0,
    submissions: 0,
    pendingSubmissions: 0,
  })
  const [recentAssignments, setRecentAssignments] = useState([])
  const [recentSubmissions, setRecentSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token")
        const assignmentsRes = await axios.get(`${API_URL}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setRecentAssignments(assignmentsRes.data.slice(0, 5))

        if (user.role === "admin") {
          const studentsRes = await axios.get(`${API_URL}/users/students`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const assignments = assignmentsRes.data
          let submissions = []
          let pendingCount = 0

          // Fetch submissions for first few assignments
          for (const assignment of assignments.slice(0, 3)) {
            try {
              const submissionsRes = await axios.get(`${API_URL}/assignments/${assignment._id}/submissions`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              submissions = [...submissions, ...submissionsRes.data]
              pendingCount += submissionsRes.data.filter((s) => s.status !== "graded").length
            } catch (err) {
              console.log("Submissions endpoint not available yet")
            }
          }

          setStats({
            assignments: assignments.length,
            students: studentsRes.data.length,
            submissions: submissions.length,
            pendingSubmissions: pendingCount,
          })

          setRecentSubmissions(submissions.slice(0, 5))
        } else {
          // Student logic will be added in next commit
          setStats({
            assignments: assignmentsRes.data.filter((a) => a.published).length,
            submissions: 0,
            pendingSubmissions: 0,
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

      {/* Stats Cards */}
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

        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100 border-warning">
            <Card.Body>
              <h3 className="h5 text-muted">Pending Grading</h3>
              <h2 className="display-4 text-warning">{stats.pendingSubmissions}</h2>
              <small className="text-muted">Needs attention</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Items */}
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Recent Assignments</Card.Title>
              <Link to="/assignments" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </Card.Header>
            <Card.Body>
              {recentAssignments.length > 0 ? (
                <ListGroup variant="flush">
                  {recentAssignments.map((assignment) => (
                    <ListGroup.Item
                      key={assignment._id}
                      className="d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <Link to={`/assignments/${assignment._id}`} className="text-decoration-none">
                          <strong>{assignment.title}</strong>
                        </Link>
                        <br />
                        <small className="text-muted">Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                      </div>
                      <Badge bg={assignment.published ? "success" : "warning"}>
                        {assignment.published ? "Published" : "Draft"}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No assignments yet.</p>
                  {user.role === "admin" && (
                    <Link to="/create-assignment" className="btn btn-primary">
                      Create Your First Assignment
                    </Link>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard