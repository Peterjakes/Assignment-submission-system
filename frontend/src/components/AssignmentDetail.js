import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Card, Button } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"

const AssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

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
      console.error("Error:", error)
      setLoading(false)
    }
  }

  if (loading) return <div className="d-flex justify-content-center p-5">Loading assignment...</div>
  if (!assignment) return <div className="alert alert-danger">Assignment not found</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{assignment.title}</h2>
        <Button variant="outline-secondary" onClick={() => navigate("/assignments")}>
          ← Back to Assignments
        </Button>
      </div>

      <Card>
        <Card.Header>
          <h5>Assignment Details</h5>
        </Card.Header>
        <Card.Body>
          <p><strong>Description:</strong> {assignment.description}</p>
          <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleString()}</p>
          <p><strong>Total Points:</strong> {assignment.totalMarks}</p>
          <p><strong>Created By:</strong> {assignment.createdBy?.fullName}</p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AssignmentDetail