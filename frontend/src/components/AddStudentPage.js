import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AddStudentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
  })
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
  
  return (
    <div>
      
    </div>
  )
}

export default AddStudentPage