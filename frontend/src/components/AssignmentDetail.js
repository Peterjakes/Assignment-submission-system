import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const AssignmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_URL = "http://localhost:5000/api"

  useEffect(() => {
    fetchAssignment()
  }, [id])

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`${API_URL}/assignments/${id}`)
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
      <button onClick={() => navigate("/assignments")}>Back</button>
    </div>
  )
}

export default AssignmentDetail