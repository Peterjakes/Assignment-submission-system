import { useState, useEffect } from "react"
import { Card } from "react-bootstrap"

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate loading for now
    setTimeout(() => {
      setStudents([])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) return <div>Loading students...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>Student List</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>No students found.</p>
      </Card.Body>
    </Card>
  )
}

export default StudentList