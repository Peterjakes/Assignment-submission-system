import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { Card, Form, Button } from "react-bootstrap"

const ChangePassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, text: "Weak", color: "danger" }
    if (strength <= 4) return { strength, text: "Medium", color: "warning" }
    return { strength, text: "Strong", color: "success" }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const token = sessionStorage.getItem("token")

      await axios.put(
        `${API_URL}/users/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      toast.success("Password changed successfully!")
      
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || "Failed to change password"
      toast.error(errorMessage)

      if (error.response?.status === 400) {
        setFormData({ ...formData, currentPassword: "" })
        setErrors({ currentPassword: "Current password is incorrect" })
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card className="w-100" style={{ maxWidth: "500px" }}>
        <Card.Header>
          <Card.Title>Change Password</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password *</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                isInvalid={!!errors.currentPassword}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.currentPassword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password *</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                isInvalid={!!errors.newPassword}
                required
                minLength="6"
              />
              <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>

              {formData.newPassword && (
                <div className="mt-2">
                  <small className={`text-${passwordStrength.color}`}>
                    Password strength: <strong>{passwordStrength.text}</strong>
                  </small>
                  <div className="progress mt-1" style={{ height: "4px" }}>
                    <div
                      className={`progress-bar bg-${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password *</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                isInvalid={!!errors.confirmPassword}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>

              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <small className="text-success">✓ Passwords match</small>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ChangePassword