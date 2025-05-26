import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Form, Button } from "react-bootstrap"

function AddStudentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
  })

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")

      // Transform the data to match your API expectations
      const studentData = {
        username: `${data.firstname.toLowerCase()}.${data.lastname.toLowerCase()}`,
        password: "password123", // Default password that can be changed later
        fullName: `${data.firstname} ${data.lastname}`,
        email: `${data.firstname.toLowerCase()}.${data.lastname.toLowerCase()}@example.com`,
        studentId: `STU${Math.floor(10000 + Math.random() * 90000)}`,
        role: "student",
        gender: data.gender,
      }

      await axios.post(`${API_URL}/users`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      toast.success("Student added successfully!")
      setData({
        firstname: "",
        lastname: "",
        gender: "",
      })
      navigate("/students")
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Failed to add student. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Header>
          <Card.Title>Add Student</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstname" value={data.firstname} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastname" value={data.lastname} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={data.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate("/students")}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Student"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AddStudentPage
