const createError = require("http-errors")
const mongoose = require("mongoose")
const User = require("../models/User")
const { updateUserSchema, registerSchema } = require("../helpers/validationSchema")

const userController = {
  // Create a new user (student or admin/lecturer)
  createUser: async (req, res, next) => {
    try {
      // Validate request body
      const result = await registerSchema.validateAsync(req.body)

      const { username, email } = result

      // Check if user already exists
      const exists = await User.findOne({ $or: [{ username }, { email }] })
      if (exists) {
        throw createError.Conflict(`${exists.username === username ? "Username" : "Email"} is already registered`)
      }

      // Create new user
      const user = new User(result)
      const savedUser = await user.save()

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: savedUser._id,
          username: savedUser.username,
          role: savedUser.role,
          fullName: savedUser.fullName,
          email: savedUser.email,
          studentId: savedUser.studentId,
        },
      })
    } catch (error) {
      console.error("Create user error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      next(error)
    }
  },

  // Get all users
  getAllUsers: async (req, res, next) => {
    try {
      // Don't return password field
      const users = await User.find({}, "-password")
      res.json(users)
    } catch (error) {
      console.error("Get users error:", error.message)
      next(error)
    }
  },

  // Get all students (users with role="student")
  getStudents: async (req, res, next) => {
    try {
      const students = await User.find({ role: "student" }, "-password")
      res.json(students)
    } catch (error) {
      console.error("Get students error:", error.message)
      next(error)
    }
  },

  // Get all lecturers/admins (users with role="admin")
  getLecturers: async (req, res, next) => {
    try {
      const lecturers = await User.find({ role: "admin" }, "-password")
      res.json(lecturers)
    } catch (error) {
      console.error("Get lecturers error:", error.message)
      next(error)
    }
  },

  // Get user by ID
  getUserById: async (req, res, next) => {
    const id = req.params.id

    try {
      const user = await User.findById(id, "-password")
      if (!user) {
        throw createError(404, "User does not exist")
      }
      res.json(user)
    } catch (error) {
      console.error("Get user error:", error.message)
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid user ID"))
      }
      next(error)
    }
  },

  // Update user
  updateUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const update = await updateUserSchema.validateAsync(req.body)

      // Find user first to handle password separately
      const user = await User.findById(id)
      if (!user) {
        throw createError(404, "User does not exist")
      }

      // Handle password update separately to ensure it gets hashed
      if (update.password) {
        user.password = update.password // Will be hashed by the pre-save hook
        delete update.password
      }

      // Update other fields
      Object.keys(update).forEach((key) => {
        user[key] = update[key]
      })

      // Save the updated user
      await user.save()

      res.json({
        message: "User updated successfully",
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
        },
      })
    } catch (error) {
      console.error("Update user error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid user ID"))
      }
      next(error)
    }
  },

  // Delete user
  deleteUser: async (req, res, next) => {
    const { id } = req.params

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid user ID format"))
    }

    try {
      const user = await User.findByIdAndDelete(id)

      if (!user) {
        return next(createError(404, "User does not exist"))
      }

      res.status(200).json({
        message: "User deleted successfully",
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      })
    } catch (error) {
      console.error("Delete user error:", error.message)
      next(error)
    }
  },
}

module.exports = userController