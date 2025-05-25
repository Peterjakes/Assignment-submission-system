import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Table, Button, Badge, Form, Row, Col } from "react-bootstrap"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token")
        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch users")
        setLoading(false)
        console.error(err)
      }
    }

    fetchUsers()
  }, [API_URL])

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = sessionStorage.getItem("token")
        await axios.delete(`${API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(users.filter((user) => user._id !== id))
        toast.success("User deleted successfully")
      } catch (err) {
        toast.error("Failed to delete user")
        console.error(err)
      }
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = sessionStorage.getItem("token")
      await axios.patch(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
      toast.success("User role updated successfully")
    } catch (err) {
      toast.error("Failed to update user role")
      console.error(err)
    }
  }

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true
    return user.role === filter
  })

  if (loading) return <div className="d-flex justify-content-center p-5">Loading users...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>User Management</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Role</Form.Label>
              <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="lecturer">Lecturers</option>
                <option value="student">Students</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Student ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <Badge bg={user.role === "admin" ? "danger" : user.role === "lecturer" ? "warning" : "primary"}>
                    {user.role}
                  </Badge>
                </td>
                <td>{user.studentId || "N/A"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Form.Select
                      size="sm"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      style={{ width: "120px" }}
                    >
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default UserManagement