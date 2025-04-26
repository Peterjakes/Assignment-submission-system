const express = require("express")
const assignmentController = require("../controllers/assignmentController")
const { verifyAccessToken, restrict } = require("../helpers/jwtHelper")

const router = express.Router()

// Create new assignment (admin only)
router.post("/", verifyAccessToken, restrict("admin"), assignmentController.createAssignment)

// Get all assignments
router.get("/", verifyAccessToken, assignmentController.getAllAssignments)

// Get specific assignment
router.get("/:id", verifyAccessToken, assignmentController.getAssignmentById)

// Update assignment (admin only)
router.put("/:id", verifyAccessToken, restrict("admin"), assignmentController.updateAssignment)

// Publish assignment (admin only)
router.patch("/:id/publish", verifyAccessToken, restrict("admin"), assignmentController.publishAssignment)

// Delete assignment (admin only)
router.delete("/:id", verifyAccessToken, restrict("admin"), assignmentController.deleteAssignment)

// Submit assignment (students)
router.post("/:id/submit", verifyAccessToken, restrict("student"), assignmentController.submitAssignment)

// Get submissions for an assignment
router.get("/:id/submissions", verifyAccessToken, assignmentController.getSubmissions)

// Get student submissions
router.get("/my-submissions", verifyAccessToken, restrict("student"), assignmentController.getStudentSubmissions)

// Get submissions for a specific student (admin only)
router.get(
  "/students/:studentId/submissions",
  verifyAccessToken,
  restrict("admin"),
  assignmentController.getStudentSubmissions,
)

// Grade submission (admin only)
router.patch("/submissions/:id/grade", verifyAccessToken, restrict("admin"), assignmentController.gradeSubmission)

module.exports = router