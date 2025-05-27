import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Table, Button } from "react-bootstrap"

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Changed from localStorage to sessionStorage
        const token = sessionStorage.getItem("token")
        console.log("📋 StudentList - Token found:", token ? "Yes" : "No") // Debug log
        
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
        console.error("❌ StudentList fetch error:", err)
      }
    }

    fetchStudents()
  }, [API_URL])

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        // Changed from localStorage to sessionStorage
        const token = sessionStorage.getItem("token")
        await axios.delete(`${API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setStudents(students.filter((student) => student._id !== id))
        toast.success("Student deleted successfully")
      } catch (err) {
        toast.error("Failed to delete student")
        console.error(err)
      }
    }
  }

  if (loading) return <div className="d-flex justify-content-center p-5">Loading students...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title>Student List</Card.Title>
        <Link to="/add-student">
          <Button variant="primary">Add New Student</Button>
        </Link>
      </Card.Header>
      <Card.Body>
        {students.length === 0 ? (
          <p className="text-center">No students found.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.studentId}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/update-student/${student._id}`}>
                        <Button variant="success" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteStudent(student._id)}>
                        Delete
                      </Button>
                      <Link to={`/students/${student._id}/submissions`}>
                        <Button variant="info" size="sm">
                          View Submissions
                        </Button>
                      </Link>
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

export default StudentList