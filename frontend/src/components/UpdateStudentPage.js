import { useState } from "react"
import { Card, Form, Button } from "react-bootstrap"

const UpdateStudentPage = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    studentId: "",
  })

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
            <Button variant="primary" type="submit">
              Update Student
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default UpdateStudentPage