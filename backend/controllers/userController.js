const createError = require("http-errors")
const mongoose = require("mongoose")
const User = require("../models/User")
const { updateUserSchema, registerSchema } = require("../helpers/validationSchema.js")

const userController = {
  // Get current user profile
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.payload.userId, "-password")
      if (!user) {
        throw createError(404, "User not found")
      }
      res.json(user)
    } catch (error) {
      console.error("Get profile error:", error.message)
      next(error)
    }
  },

  // Update current user profile
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.payload.userId
      const update = await updateUserSchema.validateAsync(req.body)

      // Remove password from profile update (use separate endpoint)
      delete update.password
      delete update.role // Users can't change their own role

      const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password")
      if (!user) {
        throw createError(404, "User not found")
      }

      res.json({
        message: "Profile updated successfully",
        user,
      })
    } catch (error) {
      console.error("Update profile error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      next(error)
    }
  },

  // Change password for current user
  changePassword: async (req, res, next) => {
    try {
      const userId = req.payload.userId
      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword) {
        throw createError(400, "Current password and new password are required")
      }

      if (newPassword.length < 6) {
        throw createError(400, "New password must be at least 6 characters")
      }

      const user = await User.findById(userId)
      if (!user) {
        throw createError(404, "User not found")
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        throw createError(400, "Current password is incorrect")
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({
        message: "Password changed successfully",
      })
    } catch (error) {
      console.error("Change password error:", error.message)
      next(error)
    }
  },

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

  // Update user (admin only)
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

  // Update user role (admin only) - NEW METHOD
  updateUserRole: async (req, res, next) => {
    try {
      const id = req.params.id
      const { role } = req.body

      if (!role || !["admin", "student"].includes(role)) {
        throw createError(400, "Valid role (admin or student) is required")
      }

      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password")

      if (!user) {
        throw createError(404, "User not found")
      }

      res.json({
        message: "User role updated successfully",
        user,
      })
    } catch (error) {
      console.error("Update user role error:", error.message)
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
