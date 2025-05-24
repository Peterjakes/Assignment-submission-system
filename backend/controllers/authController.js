const createError = require("http-errors")
const User = require("../models/User")
const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelper")
const { registerSchema, loginSchema } = require("../helpers/validationSchema.js")

const authController = {
  // Register a new user
  register: async (req, res, next) => {
    try {
      // Validate request body
      const result = await registerSchema.validateAsync(req.body)
      const { username, email } = result

      // Check if user already exists
      const exists = await User.findOne({ $or: [{ username }, { email }] })
      if (exists) {
        throw createError.Conflict(`${exists.username === username ? "Username" : "Email"} is already registered`)
      }

      // Check if this is the first user in the system
      const userCount = await User.countDocuments()
      if (userCount === 0) {
        // First user is automatically an admin
        result.role = "admin"
      }

      // Create new user
      const user = new User(result)
      const savedUser = await user.save()

      // Generate tokens
      const accessToken = await signAccessToken(savedUser.id, savedUser.role)
      const refreshToken = await signRefreshToken(savedUser.id)

      res.status(201).json({
        message: "User registered successfully",
        accessToken,
        refreshToken,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          role: savedUser.role,
          fullName: savedUser.fullName,
          email: savedUser.email,
        },
      })
    } catch (error) {
      console.error("Registration error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      next(error)
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      // Validate request body
      const result = await loginSchema.validateAsync(req.body)
      const { email, password } = result

      // Find user
      const user = await User.findOne({ email })
      if (!user) {
        throw createError.NotFound("User not registered")
      }

      // Verify password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        throw createError.Unauthorized("Invalid email/password")
      }

      // Generate tokens
      const accessToken = await signAccessToken(user.id, user.role)
      const refreshToken = await signRefreshToken(user.id)

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch (error) {
      console.error("Login error:", error.message)
      if (error.isJoi === true) {
        return next(createError.BadRequest("Invalid email/password"))
      }
      next(error)
    }
  },

  // Special first admin setup - only works when no users exist
  setupFirstAdmin: async (req, res, next) => {
    try {
      // Check if any users exist
      const userCount = await User.countDocuments()
      if (userCount > 0) {
        return next(createError.Forbidden("System is already set up with users"))
      }

      // Validate request body
      const result = await registerSchema.validateAsync(req.body)
      result.role = "admin" // Force admin role

      // Create first admin
      const user = new User(result)
      const savedUser = await user.save()

      // Generate tokens
      const accessToken = await signAccessToken(savedUser.id, savedUser.role)
      const refreshToken = await signRefreshToken(savedUser.id)

      res.status(201).json({
        message: "First admin created successfully",
        accessToken,
        refreshToken,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          role: savedUser.role,
          fullName: savedUser.fullName,
          email: savedUser.email,
        },
      })
    } catch (error) {
      console.error("Setup first admin error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      next(error)
    }
  },
}

module.exports = authController