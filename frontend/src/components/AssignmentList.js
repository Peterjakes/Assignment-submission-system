import { useState, useEffect } from "react"
import axios from "axios"
import { Card } from "react-bootstrap"

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${API_URL}/assignments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAssignments(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch assignments")
        setLoading(false)
        console.error(err)
      }
    }

    fetchAssignments()
  }, [API_URL])

  if (loading) return <div>Loading assignments...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>Assignments</Card.Title>
      </Card.Header>
      <Card.Body>
        {assignments.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          <div>
            {assignments.map((assignment) => (
              <div key={assignment._id}>{assignment.title}</div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default AssignmentList