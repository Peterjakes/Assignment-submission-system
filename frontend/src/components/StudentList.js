import { useState, useEffect } from "react"
import axios from "axios"
import { Card } from "react-bootstrap"

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${API_URL}/users/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStudents(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch students")
        setLoading(false)
        console.error(err)
      }
    }

    fetchStudents()
  }, [API_URL])

  if (loading) return <div>Loading students...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>Student List</Card.Title>
      </Card.Header>
      <Card.Body>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div>
            {students.map((student) => (
              <div key={student._id}>
                {student.fullName} - {student.email}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default StudentList