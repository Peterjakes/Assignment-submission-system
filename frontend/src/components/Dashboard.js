import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.fullName}!</p>
    </div>
  )
}

export default Dashboard