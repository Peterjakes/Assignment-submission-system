"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { Card, Row, Col, ListGroup, Badge, Button, Alert } from "react-bootstrap"

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
  const [showPasswordReminder, setShowPasswordReminder] = useState(false)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    // Check if this might be a first login (show password change reminder)
    const hasChangedPassword = sessionStorage.getItem("hasChangedPassword")
    if (!hasChangedPassword && user?.role === "student") {
      setShowPasswordReminder(true)
    }

    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token")

        console.log("📊 Fetching dashboard data...")
        console.log("🎫 Using token:", token ? "Yes" : "No")
        console.log("👤 User role:", user?.role)

        // Test token first
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        console.log("🔧 Request headers:", headers)

        const assignmentsRes = await axios.get(`${API_URL}/assignments`, { headers })
        console.log("✅ Assignments fetched:", assignmentsRes.data.length)

        setRecentAssignments(assignmentsRes.data.slice(0, 5))

        if (user.role === "admin") {
          console.log("👨‍💼 Fetching admin data...")

          const studentsRes = await axios.get(`${API_URL}/users/students`, { headers })
          console.log("✅ Students fetched:", studentsRes.data.length)

          const assignments = assignmentsRes.data
          const students = studentsRes.data

          // For submissions, we'd need to fetch all submissions or get a count
          let submissions = []
          let pendingCount = 0

          for (const assignment of assignments.slice(0, 3)) {
            try {
              const submissionsRes = await axios.get(`${API_URL}/assignments/${assignment._id}/submissions`, {
                headers,
              })
              submissions = [...submissions, ...submissionsRes.data]
              pendingCount += submissionsRes.data.filter((s) => s.status !== "graded").length
            } catch (err) {
              console.log("⚠️ Submissions endpoint not available yet for assignment:", assignment._id)
            }
          }

          setStats({
            assignments: assignments.length,
            students: students.length,
            submissions: submissions.length,
            pendingSubmissions: pendingCount,
          })

          setRecentSubmissions(submissions.slice(0, 5))
        } else {
          console.log("🎓 Fetching student data...")

          // Student dashboard data
          try {
            const mySubmissionsRes = await axios.get(`${API_URL}/assignments/my-submissions`, { headers })
            const submissions = mySubmissionsRes.data

            setStats({
              assignments: assignmentsRes.data.filter((a) => a.published).length,
              submissions: submissions.length,
              pendingSubmissions: submissions.filter((s) => s.status !== "graded").length,
            })

            setRecentSubmissions(submissions.slice(0, 5))
          } catch (err) {
            console.log("⚠️ My submissions endpoint not available yet")
            setStats({
              assignments: assignmentsRes.data.filter((a) => a.published).length,
              submissions: 0,
              pendingSubmissions: 0,
            })
          }
        }

        setLoading(false)
        console.log("✅ Dashboard data loaded successfully")
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error)
        console.error("❌ Error response:", error.response?.data)
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, API_URL])

  const dismissPasswordReminder = () => {
    setShowPasswordReminder(false)
    sessionStorage.setItem("hasChangedPassword", "reminded")
  }

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

      {/* Password Change Reminder for Students */}
      {showPasswordReminder && user.role === "student" && (
        <Alert variant="warning" dismissible onClose={dismissPasswordReminder} className="mb-4">
          <Alert.Heading>🔐 Security Reminder</Alert.Heading>
          <p>
            Welcome! For your security, we recommend changing your password from the one provided by your administrator.
          </p>
          <div className="d-flex gap-2">
            <Link to="/change-password" className="btn btn-warning btn-sm">
              Change Password Now
            </Link>
            <Button variant="outline-warning" size="sm" onClick={dismissPasswordReminder}>
              Remind Me Later
            </Button>
          </div>
        </Alert>
      )}

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
              <Link
                to={user.role === "admin" ? "/assignments" : "/my-submissions"}
                className="btn btn-outline-info btn-sm"
              >
                View All
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center h-100 border-warning">
            <Card.Body>
              <h3 className="h5 text-muted">{user.role === "admin" ? "Pending Grading" : "Pending Feedback"}</h3>
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

        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Recent Submissions</Card.Title>
              <Link
                to={user.role === "admin" ? "/assignments" : "/my-submissions"}
                className="btn btn-outline-primary btn-sm"
              >
                View All
              </Link>
            </Card.Header>
            <Card.Body>
              {recentSubmissions.length > 0 ? (
                <ListGroup variant="flush">
                  {recentSubmissions.map((submission) => (
                    <ListGroup.Item
                      key={submission._id}
                      className="d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <Link to={`/assignments/${submission.assignment._id}`} className="text-decoration-none">
                          <strong>{submission.assignment.title}</strong>
                        </Link>
                        <br />
                        <small className="text-muted">
                          {user.role === "admin" ? `By: ${submission.student?.fullName}` : "Your submission"}
                        </small>
                      </div>
                      <div className="text-end">
                        <Badge bg={submission.status === "graded" ? "success" : "warning"}>{submission.status}</Badge>
                        {submission.status === "graded" && (
                          <div>
                            <Badge bg="info" className="mt-1">
                              {submission.marks}/{submission.assignment.totalMarks}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No submissions yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions for Admin */}
      {user.role === "admin" && (
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Quick Actions</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="mb-2">
                    <Link to="/create-assignment" className="btn btn-primary w-100">
                      Create Assignment
                    </Link>
                  </Col>
                  <Col md={3} className="mb-2">
                    <Link to="/add-student" className="btn btn-success w-100">
                      Add Student
                    </Link>
                  </Col>
                  <Col md={3} className="mb-2">
                    <Link to="/user-management" className="btn btn-info w-100">
                      Manage Users
                    </Link>
                  </Col>
                  <Col md={3} className="mb-2">
                    <Link to="/assignments" className="btn btn-outline-primary w-100">
                      View All Assignments
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default Dashboard
