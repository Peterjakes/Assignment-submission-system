const express = require("express")
const authController = require("../controllers/authController")

const router = express.Router()

// Public routes
router.post("/setup-first-admin", authController.setupFirstAdmin)
router.post("/login", authController.login)
router.post("/register", authController.register)

module.exports = router
