import { useState, useEffect } from "react"
import axios from "axios"
import { Card, Table } from "react-bootstrap"

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }
        
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

  if (loading) return <div className="d-flex justify-content-center p-5">Loading assignments...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>Assignments</Card.Title>
      </Card.Header>
      <Card.Body>
        {assignments.length === 0 ? (
          <p className="text-center">No assignments found.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.title}</td>
                  <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default AssignmentList