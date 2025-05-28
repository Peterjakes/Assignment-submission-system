import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Form, Button, Row, Col, Alert, Modal } from "react-bootstrap"

function AddStudentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [createdStudent, setCreatedStudent] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    generatePassword: true,
    customPassword: "",
  })

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  // Generate random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  // Generate username from full name
  const generateUsername = (fullName) => {
    return fullName
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9.]/g, "")
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")

      // Generate username and password
      const username = generateUsername(formData.fullName)
      const password = formData.generatePassword ? generateRandomPassword() : formData.customPassword

      // Prepare student data
      const studentData = {
        username: username,
        password: password,
        fullName: formData.fullName,
        email: formData.email,
        studentId: formData.studentId,
        role: "student",
      }

      // Create student account
      const response = await axios.post(`${API_URL}/auth/register`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Store created student info with credentials
      setCreatedStudent({
        ...response.data.user,
        username: username,
        password: password,
      })

      // Show credentials modal
      setShowCredentials(true)

      toast.success("Student account created successfully!")

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        studentId: "",
        generatePassword: true,
        customPassword: "",
      })
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Failed to create student account. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleCloseModal = () => {
    setShowCredentials(false)
    setCreatedStudent(null)
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        <Card className="w-100" style={{ maxWidth: "600px" }}>
          <Card.Header>
            <Card.Title>Create Student Account</Card.Title>
            <small className="text-muted">Admin will provide login credentials to the student</small>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g., John Smith"
                      required
                    />
                    <Form.Text className="text-muted">
                      Username will be auto-generated:{" "}
                      {formData.fullName ? generateUsername(formData.fullName) : "john.smith"}
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@school.edu"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student ID *</Form.Label>
                    <Form.Control
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="STU12345"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="generatePassword"
                      checked={formData.generatePassword}
                      onChange={handleChange}
                      label="Generate random password (recommended)"
                    />
                  </Form.Group>

                  {!formData.generatePassword && (
                    <Form.Group className="mb-3">
                      <Form.Label>Custom Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="customPassword"
                        value={formData.customPassword}
                        onChange={handleChange}
                        placeholder="Enter custom password"
                        minLength="6"
                        required={!formData.generatePassword}
                      />
                      <Form.Text className="text-muted">Minimum 6 characters</Form.Text>
                    </Form.Group>
                  )}
                </Col>
              </Row>

              <Alert variant="info">
                <strong>📋 Process:</strong>
                <ol className="mb-0 mt-2">
                  <li>Fill out student information</li>
                  <li>System generates username and password</li>
                  <li>You receive the login credentials</li>
                  <li>Share credentials with the student securely</li>
                </ol>
              </Alert>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => navigate("/students")}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Student Account"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      {/* Credentials Modal */}
      <Modal show={showCredentials} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 Student Account Created Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <strong>Account created for:</strong> {createdStudent?.fullName}
          </Alert>

          <Card className="mb-3">
            <Card.Header>
              <strong>📋 Login Credentials</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Username:</strong>
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control type="text" value={createdStudent?.username || ""} readOnly />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="ms-2"
                        onClick={() => copyToClipboard(createdStudent?.username || "")}
                      >
                        Copy
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Password:</strong>
                    </Form.Label>
                    <div className="d-flex">
                      <Form.Control type="text" value={createdStudent?.password || ""} readOnly />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="ms-2"
                        onClick={() => copyToClipboard(createdStudent?.password || "")}
                      >
                        Copy
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Email:</strong>
                    </Form.Label>
                    <Form.Control type="text" value={createdStudent?.email || ""} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Student ID:</strong>
                    </Form.Label>
                    <Form.Control type="text" value={createdStudent?.studentId || ""} readOnly />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Alert variant="warning">
            <strong>🔐 Security Instructions:</strong>
            <ul className="mb-0 mt-2">
              <li>Share these credentials with the student securely (in person, encrypted email, etc.)</li>
              <li>Advise the student to change their password after first login</li>
              <li>Do not share credentials over unsecured channels</li>
              <li>Keep a secure record of student accounts created</li>
            </ul>
          </Alert>

          <Alert variant="info">
            <strong>📧 Suggested Email Template:</strong>
            <div className="mt-2 p-2 bg-light rounded">
              <small>
                <strong>Subject:</strong> Your Assignment System Account
                <br />
                <br />
                Dear {createdStudent?.fullName},
                <br />
                <br />
                Your account has been created for the Assignment Management System.
                <br />
                <br />
                <strong>Login URL:</strong> http://localhost:3000/login
                <br />
                <strong>Username:</strong> {createdStudent?.username}
                <br />
                <strong>Temporary Password:</strong> {createdStudent?.password}
                <br />
                <br />
                Please log in and change your password immediately.
                <br />
                <br />
                Best regards,
                <br />
                Administration
              </small>
            </div>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              const credentials = `Username: ${createdStudent?.username}\nPassword: ${createdStudent?.password}`
              copyToClipboard(credentials)
            }}
          >
            Copy All Credentials
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="success" onClick={() => navigate("/students")}>
            Go to Student List
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddStudentPage
