import { useState } from "react"
import { Card, Form, Button } from "react-bootstrap"

const Register = () => {
  return (
    <div>
      <Card>
        <Card.Body>
          <h2>Register</h2>
          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" />
            </Form.Group>
            <Button type="submit">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Register