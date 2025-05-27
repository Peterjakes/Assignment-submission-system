import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Button, Badge, Form, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"

const AssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submissionContent, setSubmissionContent] = useState("")

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchAssignment()
  }, [id])

  const fetchAssignment = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.get(`${API_URL}/assignments/${id}`, { headers })
      setAssignment(response.data)
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
    } catch (error) {
      toast.error("Failed to submit assignment")
      console.error("Submit error:", error)
    } finally {
      setSubmitting(false)
    }
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
          <p><strong>Due Date:</strong> 
            <span className={isOverdue(assignment.dueDate) ? "text-danger" : "text-success"}>
              {new Date(assignment.dueDate).toLocaleString()}
            </span>
          </p>
          <p><strong>Total Points:</strong> {assignment.totalMarks}</p>
          <p><strong>Created By:</strong> {assignment.createdBy?.fullName}</p>
          
          {user.role === "student" && assignment.published && (
            <div className="mt-3">
              <Button 
                variant={isOverdue(assignment.dueDate) ? "warning" : "primary"}
                onClick={() => setShowSubmitModal(true)}
              >
                {isOverdue(assignment.dueDate) ? "Submit Late" : "Submit Assignment"}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Submit Modal */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Submit Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Your Answer</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="Enter your solution here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting || !submissionContent.trim()}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AssignmentDetail