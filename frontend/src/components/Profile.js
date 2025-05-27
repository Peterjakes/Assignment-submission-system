import { useAuth } from "../contexts/AuthContext"
import { Card } from "react-bootstrap"

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="container-fluid">
      <Card>
        <Card.Header>
          <Card.Title>User Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <p><strong>Name:</strong> {user?.fullName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Profile