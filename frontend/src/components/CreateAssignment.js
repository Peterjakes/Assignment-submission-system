import { useState } from "react"
import { Card, Form, Button, Row, Col } from "react-bootstrap"

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalMarks: 100,
    published: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Create New Assignment</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total Marks</Form.Label>
                <Form.Control
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Publish immediately"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Assignment
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CreateAssignment