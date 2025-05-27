import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const AssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchAssignment()
  }, [id])

  const fetchAssignment = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.get(`${API_URL}/assignments/${id}`, { headers })
      setAssignment(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!assignment) return <div>Assignment not found</div>

  return (
    <div>
      <h1>{assignment.title}</h1>
      <p>{assignment.description}</p>
      <p>Due: {new Date(assignment.dueDate).toLocaleString()}</p>
      <p>Points: {assignment.totalMarks}</p>
      <button onClick={() => navigate("/assignments")}>Back</button>
    </div>
  )
}

export default AssignmentDetail