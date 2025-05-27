import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Table, Button, Badge, Form, Row, Col, Modal } from "react-bootstrap"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState("")

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchUsers()
  }, [])

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

  const openRoleModal = (user) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const handleRoleChange = async () => {
    try {
      const token = sessionStorage.getItem("token")
      await axios.patch(
        `${API_URL}/users/${selectedUser._id}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Update the user in the state
      setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, role: newRole } : user)))

      toast.success("User role updated successfully")
      setShowRoleModal(false)
      setSelectedUser(null)
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update user role")
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
    <>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="mb-0">User Management</Card.Title>
            <Badge bg="info">{filteredUsers.length} users</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Role</Form.Label>
                <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Users ({users.length})</option>
                  <option value="admin">Admins ({users.filter((u) => u.role === "admin").length})</option>
                  <option value="student">Students ({users.filter((u) => u.role === "student").length})</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {filteredUsers.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Student ID</th>
                  <th>Created</th>
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
                      <Badge bg={user.role === "admin" ? "danger" : "primary"}>{user.role}</Badge>
                    </td>
                    <td>{user.studentId || "N/A"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => openRoleModal(user)}>
                          Change Role
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Role Change Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p>
                <strong>User:</strong> {selectedUser.fullName}
              </p>
              <p>
                <strong>Current Role:</strong>{" "}
                <Badge bg={selectedUser.role === "admin" ? "danger" : "primary"}>{selectedUser.role}</Badge>
              </p>

              <Form.Group className="mt-3">
                <Form.Label>New Role</Form.Label>
                <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <div className="mt-3 p-3 bg-light rounded">
                <strong>Role Permissions:</strong>
                <ul className="mb-0 mt-2">
                  <li>
                    <strong>Student:</strong> View assignments, submit work, view grades
                  </li>
                  <li>
                    <strong>Admin:</strong> Full access - manage users, assignments, and grades
                  </li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRoleChange} disabled={!newRole || newRole === selectedUser?.role}>
            Update Role
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserManagement
