import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Button, Badge, Form, Alert, Modal, Tabs, Tab } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"

const AssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submissionContent, setSubmissionContent] = useState("")
  const [activeTab, setActiveTab] = useState("assignment")

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchAssignmentData()
  }, [id])

  const fetchAssignmentData = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      const assignmentRes = await axios.get(`${API_URL}/assignments/${id}`, { headers })
      setAssignment(assignmentRes.data)

      if (user.role === "student") {
        try {
          const submissionsRes = await axios.get(`${API_URL}/assignments/${id}/submissions`, { headers })
          const mySubmission = submissionsRes.data.find((sub) => sub.student._id === user.id)
          setSubmission(mySubmission)
          
          if (mySubmission) {
            setActiveTab("submission")
          }
        } catch (err) {
          console.log("No submissions found")
        }
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching assignment:", error)
      toast.error("Failed to load assignment")
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please enter your submission content")
      return
    }

    try {
      setSubmitting(true)
      const token = sessionStorage.getItem("token")

      await axios.post(
        `${API_URL}/assignments/${id}/submit`,
        { content: submissionContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      toast.success("Assignment submitted successfully!")
      setShowSubmitModal(false)
      setSubmissionContent("")
      setActiveTab("submission")
      fetchAssignmentData()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Failed to submit assignment")
      console.error("Submit error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate)
  }

  const getTimeRemaining = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due - now

    if (diff <= 0) return "Overdue"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} remaining`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} remaining`
    return "Due soon"
  }

  if (loading) return <div className="d-flex justify-content-center p-5">Loading assignment...</div>
  if (!assignment) return <div className="alert alert-danger">Assignment not found</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{assignment.title}</h2>
          <div className="d-flex gap-2 mt-2">
            <Badge bg={assignment.published ? "success" : "warning"}>
              {assignment.published ? "Published" : "Draft"}
            </Badge>
            <Badge bg={isOverdue(assignment.dueDate) ? "danger" : "info"}>
              {getTimeRemaining(assignment.dueDate)}
            </Badge>
            <Badge bg="secondary">{assignment.totalMarks} points</Badge>
          </div>
        </div>
        <Button variant="outline-secondary" onClick={() => navigate("/assignments")}>
          ← Back to Assignments
        </Button>
      </div>

      {user.role === "student" ? (
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="assignment" title="📚 Assignment">
            <Card>
              <Card.Header>
                <h5>Assignment Instructions</h5>
              </Card.Header>
              <Card.Body>
                <div className="bg-light p-3 rounded mb-3">
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                    {assignment.description}
                  </pre>
                </div>
                <p><strong>Due Date:</strong> 
                  <span className={isOverdue(assignment.dueDate) ? "text-danger" : "text-success"}>
                    {formatDate(assignment.dueDate)}
                  </span>
                </p>
                <p><strong>Total Points:</strong> {assignment.totalMarks}</p>
                <p><strong>Created By:</strong> {assignment.createdBy?.fullName}</p>
                
                <Alert variant={submission ? "success" : isOverdue(assignment.dueDate) ? "danger" : "info"}>
                  {submission ? (
                    <div>
                      <strong>✅ Submitted!</strong> You have already submitted this assignment.
                      <div className="mt-2">
                        <Button variant="outline-success" size="sm" onClick={() => setActiveTab("submission")}>
                          View Your Submission
                        </Button>
                      </div>
                    </div>
                  ) : assignment.published ? (
                    <div>
                      <strong>{isOverdue(assignment.dueDate) ? "⚠️ Overdue:" : "📝 Ready to Submit:"}</strong>
                      {isOverdue(assignment.dueDate) 
                        ? " This assignment is past due, but you can still submit." 
                        : " Read the instructions and submit your work."}
                      <div className="mt-2">
                        <Button
                          variant={isOverdue(assignment.dueDate) ? "warning" : "primary"}
                          onClick={() => setShowSubmitModal(true)}
                        >
                          {isOverdue(assignment.dueDate) ? "Submit Late" : "Submit Assignment"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <strong>⏳ Not Available:</strong> This assignment is not yet published.
                    </div>
                  )}
                </Alert>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="submission" title={`📝 My Submission ${submission ? "✅" : ""}`} disabled={!submission}>
            {submission && (
              <Card>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>Your Submission</h5>
                    <Badge bg={submission.status === "graded" ? "success" : "info"}>
                      {submission.status}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</p>
                  <div className="bg-light p-3 rounded">
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                      {submission.content}
                    </pre>
                  </div>
                  {submission.status === "graded" && (
                    <div className="mt-3">
                      <p><strong>Grade:</strong> {submission.marks}/{assignment.totalMarks}</p>
                      {submission.feedback && (
                        <div>
                          <strong>Feedback:</strong>
                          <div className="bg-info bg-opacity-10 p-3 rounded mt-2">
                            {submission.feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Tab>
        </Tabs>
      ) : (
        <Card>
          <Card.Header>
            <h5>Assignment Details</h5>
          </Card.Header>
          <Card.Body>
            <div className="bg-light p-3 rounded mb-3">
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                {assignment.description}
              </pre>
            </div>
            <p><strong>Due Date:</strong> {formatDate(assignment.dueDate)}</p>
            <p><strong>Total Points:</strong> {assignment.totalMarks}</p>
            <p><strong>Created By:</strong> {assignment.createdBy?.fullName}</p>
          </Card.Body>
        </Card>
      )}

      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Submit Assignment: {assignment.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Your Answer</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="Enter your complete solution here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>
          <Button
            variant={isOverdue(assignment.dueDate) ? "warning" : "primary"}
            onClick={handleSubmit}
            disabled={submitting || !submissionContent.trim()}
          >
            {submitting ? "Submitting..." : isOverdue(assignment.dueDate) ? "Submit Late" : "Submit Assignment"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AssignmentDetail