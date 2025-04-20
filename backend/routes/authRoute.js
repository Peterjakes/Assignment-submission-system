const express = require("express")
const authController = require("../controllers/authController")
const { verifyAccessToken, restrict } = require("../helpers/jwtHelper")

const routes = express.Router()

// Public routes
routes.post("/setup-first-admin", authController.setupFirstAdmin)
routes.post("/login", authController.login)

// Protected routes
routes.get("/users", verifyAccessToken, restrict("admin"), authController.getAllUsers)
routes.get("/users/:id", verifyAccessToken, authController.getUserById)
routes.delete("/users/:id", verifyAccessToken, restrict("admin"), authController.deleteUser)

module.exports = routes