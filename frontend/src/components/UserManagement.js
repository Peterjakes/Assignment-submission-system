import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Table, Button } from "react-bootstrap"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="d-flex justify-content-center p-5">Loading users...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <Card>
      <Card.Header>
        <Card.Title>User Management</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </Button>
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