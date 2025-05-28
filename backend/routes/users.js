const express = require("express")
const userController = require("../controllers/userController")
const { verifyAccessToken, restrict } = require("../helpers/jwtHelper")

const router = express.Router()


// Get current user profile
router.get("/profile", verifyAccessToken, userController.getProfile)

// Update current user profile
router.put("/profile", verifyAccessToken, userController.updateProfile)

// Change password (for current user) - FIXED ROUTE
router.put("/change-password", verifyAccessToken, userController.changePassword)

// Create new user (admin only)
router.post("/", verifyAccessToken, restrict("admin"), userController.createUser)

// Get all users (admin only)
router.get("/", verifyAccessToken, restrict("admin"), userController.getAllUsers)

// Get all students (admin only)
router.get("/students", verifyAccessToken, restrict("admin"), userController.getStudents)

// Get all lecturers (admin only)
router.get("/lecturers", verifyAccessToken, restrict("admin"), userController.getLecturers)

// Get specific user (admin only or own profile)
router.get("/:id", verifyAccessToken, userController.getUserById)

// Update user (admin only)
router.put("/:id", verifyAccessToken, restrict("admin"), userController.updateUser)

// Update user role (admin only) - FIXED ROUTE
router.patch("/:id/role", verifyAccessToken, restrict("admin"), userController.updateUserRole)

// Delete user (admin only)
router.delete("/:id", verifyAccessToken, restrict("admin"), userController.deleteUser)

module.exports = router
