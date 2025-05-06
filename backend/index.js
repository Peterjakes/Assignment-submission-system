const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const createError = require("http-errors")
require("./helpers/init_mongodb")
const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/users")
const assignmentRoutes = require("./routes/assignments")

dotenv.config()

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/assignments", assignmentRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...")
})

// 404 handler
app.use((req, res, next) => {
  next(createError.NotFound("Route not found"))
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
