import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Table, Button, Badge, Modal, Form, Row, Col, Alert } from "react-bootstrap"

const SubmissionList = () => {
  const { assignmentId } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [gradeData, setGradeData] = useState({ marks: "", feedback: "" })
  const [grading, setGrading] = useState(false)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchData()
  }, [assignmentId])

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch assignment details
      const assignmentRes = await axios.get(`${API_URL}/assignments/${assignmentId}`, { headers })
      setAssignment(assignmentRes.data)

      // Fetch submissions
      const submissionsRes = await axios.get(`${API_URL}/assignments/${assignmentId}/submissions`, { headers })
      setSubmissions(submissionsRes.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load submissions")
      setLoading(false)
    }
  }

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission)
    setGradeData({
      marks: submission.marks || "",
      feedback: submission.feedback || "",
    })
    setShowGradeModal(true)
  }

  const handleGrade = async () => {
    try {
      setGrading(true)
      const token = sessionStorage.getItem("token")

      await axios.patch(
        `${API_URL}/assignments/submissions/${selectedSubmission._id}/grade`,
        {
          marks: Number.parseInt(gradeData.marks),
          feedback: gradeData.feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      toast.success("Submission graded successfully!")
      setShowGradeModal(false)
      fetchData() // Refresh submissions
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Failed to grade submission")
      console.error("Grade error:", error)
    } finally {
      setGrading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getGradeColor = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100
    if (percentage >= 90) return "success"
    if (percentage >= 80) return "info"
    if (percentage >= 70) return "warning"
    return "danger"
  }

  if (loading) return <div className="d-flex justify-content-center p-5">Loading submissions...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Submissions: {assignment?.title}</h2>
          <p className="text-muted mb-0">
            Total: {submissions.length} | Graded: {submissions.filter((s) => s.status === "graded").length} | Pending:{" "}
            {submissions.filter((s) => s.status !== "graded").length}
          </p>
        </div>
        <Link to={`/assignments/${assignmentId}`}>
          <Button variant="outline-secondary">← Back to Assignment</Button>
        </Link>
      </div>

      {assignment && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h6>Assignment Details</h6>
                <p className="mb-1">
                  <strong>Due:</strong> {formatDate(assignment.dueDate)}
                </p>
                <p className="mb-0">
                  <strong>Total Points:</strong> {assignment.totalMarks}
                </p>
              </Col>
              <Col md={4} className="text-end">
                <Badge bg={assignment.published ? "success" : "warning"}>
                  {assignment.published ? "Published" : "Draft"}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <Card.Title className="mb-0">Student Submissions</Card.Title>
        </Card.Header>
        <Card.Body>
          {submissions.length === 0 ? (
            <Alert variant="info">
              <h6>No submissions yet</h6>
              <p className="mb-0">Students haven't submitted their work for this assignment yet.</p>
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td>{submission.student.fullName}</td>
                    <td>{submission.student.studentId}</td>
                    <td>
                      {formatDate(submission.submittedAt)}
                      {submission.status === "late" && (
                        <Badge bg="warning" className="ms-2">
                          Late
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Badge bg={submission.status === "graded" ? "success" : "warning"}>{submission.status}</Badge>
                    </td>
                    <td>
                      {submission.status === "graded" ? (
                        <Badge bg={getGradeColor(submission.marks, assignment.totalMarks)}>
                          {submission.marks}/{assignment.totalMarks}
                        </Badge>
                      ) : (
                        <span className="text-muted">Not graded</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => openGradeModal(submission)}>
                          {submission.status === "graded" ? "Edit Grade" : "Grade"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Grade Submission Modal */}
      <Modal show={showGradeModal} onHide={() => setShowGradeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Grade Submission: {selectedSubmission?.student.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubmission && (
            <div>
              <Alert variant="info">
                <strong>Student:</strong> {selectedSubmission.student.fullName} ({selectedSubmission.student.studentId})
                <br />
                <strong>Submitted:</strong> {formatDate(selectedSubmission.submittedAt)}
                <br />
                <strong>Status:</strong> {selectedSubmission.status}
              </Alert>

              <div className="mb-4">
                <h6>Student's Submission:</h6>
                <div className="bg-light p-3 rounded border" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
                    {selectedSubmission.content}
                  </pre>
                </div>
              </div>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Grade (out of {assignment?.totalMarks})</strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max={assignment?.totalMarks}
                      value={gradeData.marks}
                      onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })}
                      placeholder="Enter points"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Feedback (Optional)</strong>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                      placeholder="Provide feedback to the student..."
                    />
                  </Form.Group>
                </Col>
              </Row>

              {gradeData.marks && assignment && (
                <Alert variant="light">
                  <strong>Grade Preview:</strong> {gradeData.marks}/{assignment.totalMarks} (
                  {Math.round((gradeData.marks / assignment.totalMarks) * 100)}%)
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGradeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGrade}
            disabled={grading || !gradeData.marks || gradeData.marks < 0 || gradeData.marks > assignment?.totalMarks}
          >
            {grading ? "Saving Grade..." : "Save Grade"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SubmissionList
