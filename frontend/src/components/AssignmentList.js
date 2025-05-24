import { useState, useEffect } from "react"
import { Card } from "react-bootstrap"

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Temporarily simulate loading
    setTimeout(() => {
      setAssignments([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) return <div>Loading assignments...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>Assignments</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>No assignments found.</p>
      </Card.Body>
    </Card>
  )
}

export default AssignmentList