const createError = require("http-errors")
const mongoose = require("mongoose")
const Assignment = require("../models/Assignment")
const Submission = require("../models/Submission")
const { assignmentSchema, submissionSchema, gradeSchema } = require("../helpers/validationSchema.js")

const assignmentController = {
  createAssignment: async (req, res, next) => {
    try {
      // Validate request body
      const result = await assignmentSchema.validateAsync(req.body)

      // Create new assignment
      const assignment = new Assignment({
        ...result,
        createdBy: req.payload.userId,
      })

      const savedAssignment = await assignment.save()
      res.status(201).json(savedAssignment)
    } catch (error) {
      console.error("Create assignment error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      next(error)
    }
  },

  getAllAssignments: async (req, res, next) => {
    try {
      // If admin, get all assignments
      // If student, get only published assignments
      const query = req.payload.role === "student" ? { published: true } : {}

      const assignments = await Assignment.find(query)
        .populate("createdBy", "username fullName")
        .sort({ createdAt: -1 })

      res.json(assignments)
    } catch (error) {
      console.error("Get assignments error:", error.message)
      next(error)
    }
  },

  getAssignmentById: async (req, res, next) => {
    try {
      const assignment = await Assignment.findById(req.params.id).populate("createdBy", "username fullName")

      if (!assignment) {
        throw createError(404, "Assignment not found")
      }

      // If student, ensure assignment is published
      if (req.payload.role === "student" && !assignment.published) {
        throw createError(403, "This assignment is not yet published")
      }

      res.json(assignment)
    } catch (error) {
      console.error("Get assignment error:", error.message)
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid assignment ID"))
      }
      next(error)
    }
  },

  updateAssignment: async (req, res, next) => {
    try {
      const id = req.params.id
      const update = await assignmentSchema.validateAsync(req.body)
      const options = { new: true }

      const assignment = await Assignment.findByIdAndUpdate(id, update, options).populate(
        "createdBy",
        "username fullName",
      )

      if (!assignment) {
        throw createError(404, "Assignment not found")
      }

      res.json(assignment)
    } catch (error) {
      console.error("Update assignment error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid assignment ID"))
      }
      next(error)
    }
  },

  publishAssignment: async (req, res, next) => {
    try {
      const id = req.params.id

      const assignment = await Assignment.findByIdAndUpdate(id, { published: true }, { new: true }).populate(
        "createdBy",
        "username fullName",
      )

      if (!assignment) {
        throw createError(404, "Assignment not found")
      }

      res.json({
        message: "Assignment published successfully",
        assignment,
      })
    } catch (error) {
      console.error("Publish assignment error:", error.message)
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid assignment ID"))
      }
      next(error)
    }
  },

  deleteAssignment: async (req, res, next) => {
    try {
      const assignment = await Assignment.findByIdAndDelete(req.params.id)

      if (!assignment) {
        throw createError(404, "Assignment not found")
      }

      // Also delete all submissions for this assignment
      await Submission.deleteMany({ assignment: req.params.id })

      res.json({
        message: "Assignment deleted successfully",
        assignment: {
          id: assignment._id,
          title: assignment.title,
        },
      })
    } catch (error) {
      console.error("Delete assignment error:", error.message)
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid assignment ID"))
      }
      next(error)
    }
  },

  submitAssignment: async (req, res, next) => {
    try {
      const assignmentId = req.params.id

      // Validate request body
      const result = await submissionSchema.validateAsync(req.body)

      // Check if assignment exists and is published
      const assignment = await Assignment.findById(assignmentId)
      if (!assignment) {
        throw createError(404, "Assignment not found")
      }

      if (!assignment.published) {
        throw createError(403, "Cannot submit to an unpublished assignment")
      }

      // Check if due date has passed
      const now = new Date()
      const isLate = now > new Date(assignment.dueDate)

      // Check if student has already submitted
      const existingSubmission = await Submission.findOne({
        assignment: assignmentId,
        student: req.payload.userId,
      })

      if (existingSubmission) {
        throw createError(400, "You have already submitted this assignment")
      }

      // Create new submission
      const submission = new Submission({
        assignment: assignmentId,
        student: req.payload.userId,
        content: result.content,
        status: isLate ? "late" : "submitted",
      })

      const savedSubmission = await submission.save()

      // Populate student and assignment details
      const populatedSubmission = await Submission.findById(savedSubmission._id)
        .populate("student", "username fullName studentId")
        .populate("assignment", "title dueDate")

      res.status(201).json(populatedSubmission)
    } catch (error) {
      console.error("Submit assignment error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid assignment ID"))
      }
      next(error)
    }
  },

  getSubmissions: async (req, res, next) => {
    try {
      const assignmentId = req.params.id

      // Check if assignment exists
      const assignment = await Assignment.findById(assignmentId)
      if (!assignment) {
        throw createError(404, "Assignment not found")
      }

      // If admin, get all submissions for the assignment
      // If student, get only their submissions
      const query = { assignment: assignmentId }
      if (req.payload.role === "student") {
        query.student = req.payload.userId
      }

      const submissions = await Submission.find(query)
        .populate("student", "username fullName studentId")
        .populate("assignment", "title dueDate totalMarks")
        .sort({ submittedAt: -1 })

      res.json(submissions)
    } catch (error) {
      console.error("Get submissions error:", error.message)
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid assignment ID"))
      }
      next(error)
    }
  },

  getStudentSubmissions: async (req, res, next) => {
    try {
      // Get all submissions for a specific student
      const studentId = req.payload.role === "student" ? req.payload.userId : req.params.studentId

      const submissions = await Submission.find({ student: studentId })
        .populate("assignment", "title description dueDate totalMarks published")
        .sort({ submittedAt: -1 })

      res.json(submissions)
    } catch (error) {
      console.error("Get student submissions error:", error.message)
      next(error)
    }
  },

  gradeSubmission: async (req, res, next) => {
    try {
      const submissionId = req.params.id

      // Validate request body
      const result = await gradeSchema.validateAsync(req.body)

      // Find submission
      const submission = await Submission.findById(submissionId)
      if (!submission) {
        throw createError(404, "Submission not found")
      }

      // Get assignment to check total marks
      const assignment = await Assignment.findById(submission.assignment)
      if (result.marks > assignment.totalMarks) {
        throw createError(400, `Marks cannot exceed the total marks (${assignment.totalMarks})`)
      }

      // Update submission
      submission.marks = result.marks
      submission.feedback = result.feedback
      submission.status = "graded"

      await submission.save()

      // Populate student and assignment details
      const populatedSubmission = await Submission.findById(submissionId)
        .populate("student", "username fullName studentId")
        .populate("assignment", "title dueDate totalMarks")

      res.json(populatedSubmission)
    } catch (error) {
      console.error("Grade submission error:", error.message)
      if (error.isJoi === true) {
        error.status = 422
      }
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid submission ID"))
      }
      next(error)
    }
  },
}

module.exports = assignmentController
