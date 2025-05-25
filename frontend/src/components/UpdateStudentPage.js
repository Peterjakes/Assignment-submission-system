import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { Card, Form, Button } from "react-bootstrap"

const UpdateStudentPage = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    email: "",
    studentId: "",
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const { fullName, email, studentId, gender } = response.data

        // Split fullName into firstname and lastname
        const nameParts = fullName.split(" ")
        const firstname = nameParts[0] || ""
        const lastname = nameParts.slice(1).join(" ") || ""

        setData({
          firstname,
          lastname,
          gender: gender || "",
          email,
          studentId,
        })
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch student data:", err)
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id, API_URL])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", data)
  }

  if (loading) return <div className="d-flex justify-content-center p-5">Loading student data...</div>

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Header>
          <Card.Title>Update Student</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text" 
                name="firstname"
                value={data.firstname}
                onChange={handleChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text" 
                name="lastname"
                value={data.lastname}
                onChange={handleChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={data.email}
                onChange={handleChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control 
                type="text" 
                name="studentId"
                value={data.studentId}
                onChange={handleChange}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select 
                name="gender" 
                value={data.gender} 
                onChange={handleChange} 
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => navigate("/students")}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Student
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default UpdateStudentPage