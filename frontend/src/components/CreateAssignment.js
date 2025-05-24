import { useState } from "react"
import { Card, Form, Button } from "react-bootstrap"

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  return (
    <Card>
      <Card.Header>
        <Card.Title>Create New Assignment</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={5} name="description" />
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