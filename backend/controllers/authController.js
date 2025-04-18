const createError = require("http-errors")
const User = require("../models/authModel")
const { registerSchema, loginSchema } = require("../helpers/validationSchema")
const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelper")

const authController = {
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
      if (error.isJoi === true) {
        error.status = 422
      }
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      // Validate request body
      const result = await loginSchema.validateAsync(req.body)

      // Find user
      const user = await User.findOne({ email: result.email })
      if (!user) {
        throw createError.NotFound("User not registered")
      }

      // Verify password
      const isMatch = await user.comparePassword(result.password)
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
      if (error.isJoi === true) {
        return next(createError.BadRequest("Invalid email/password"))
      }
      next(error)
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      // Only return necessary fields, not password
      const users = await User.find({}, "-password")
      res.json(users)
    } catch (error) {
      console.error("Get users error:", error.message)
      next(error)
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id, )
      if (!user) {
        throw createError(404, "User not found")
      }
      res.json(user)
    } catch (error) {
      console.error("Get user error:", error.message)
      next(error)
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      if (!user) {
        throw createError(404, "User not found")
      }
      res.json({ message: "User deleted successfully" })
    } catch (error) {
      console.error("Delete user error:", error.message)
      next(error)
    }
  },
}

module.exports = authController