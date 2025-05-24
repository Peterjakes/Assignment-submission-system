import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Table, Button, Badge } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

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

  const handleDeleteAssignment = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${API_URL}/assignments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAssignments(assignments.filter((assignment) => assignment._id !== id))
        toast.success("Assignment deleted successfully")
      } catch (err) {
        toast.error("Failed to delete assignment")
        console.error(err)
      }
    }
  }

  const handlePublishAssignment = async (id) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(
        `${API_URL}/assignments/${id}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update the assignment in the state
      setAssignments(
        assignments.map((assignment) => (assignment._id === id ? { ...assignment, published: true } : assignment)),
      )

      toast.success("Assignment published successfully")
    } catch (err) {
      toast.error("Failed to publish assignment")
      console.error(err)
    }
  }

  if (loading) return <div className="d-flex justify-content-center p-5">Loading assignments...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title>Assignments</Card.Title>
        {user.role === "admin" && (
          <Link to="/create-assignment">
            <Button variant="primary">Create New Assignment</Button>
          </Link>
        )}
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
                  <td>
                    {assignment.published ? <Badge bg="success">Published</Badge> : <Badge bg="warning">Draft</Badge>}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/assignments/${assignment._id}`}>
                        <Button variant="primary" size="sm">
                          View
                        </Button>
                      </Link>

                      {user.role === "admin" && (
                        <>
                          <Link to={`/update-assignment/${assignment._id}`}>
                            <Button variant="success" size="sm">
                              Edit
                            </Button>
                          </Link>

                          {!assignment.published && (
                            <Button variant="info" size="sm" onClick={() => handlePublishAssignment(assignment._id)}>
                              Publish
                            </Button>
                          )}

                          <Button variant="danger" size="sm" onClick={() => handleDeleteAssignment(assignment._id)}>
                            Delete
                          </Button>
                        </>
                      )}

                      {user.role === "student" && assignment.published && (
                        <Link to={`/assignments/${assignment._id}/submit`}>
                          <Button variant="success" size="sm">
                            Submit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
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