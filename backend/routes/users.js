const express = require("express")
const userController = require("../controllers/userController")
const { verifyAccessToken, restrict } = require("../helpers/jwtHelper")

const router = express.Router()

// Create new user (admin only)
router.post("/", verifyAccessToken, restrict("admin"), userController.createUser)

// Get all users (admin only)
router.get("/", verifyAccessToken, restrict("admin"), userController.getAllUsers)

// Get all students (admin only)
router.get("/students", verifyAccessToken, restrict("admin"), userController.getStudents)

// Get all lecturers (admin only)
router.get("/lecturers", verifyAccessToken, restrict("admin"), userController.getLecturers)

// Get specific user
router.get("/:id", verifyAccessToken, userController.getUserById)

// Update user (admin only)
router.put("/:id", verifyAccessToken, restrict("admin"), userController.updateUser)

// Delete user (admin only)
router.delete("/:id", verifyAccessToken, restrict("admin"), userController.deleteUser)

module.exports = router