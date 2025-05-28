const Joi = require("joi")

// Auth schemas
exports.authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
})

exports.registerSchema = Joi.object({
  username: Joi.string().required().min(3),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "student").default("student"),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  studentId: Joi.string().when("role", {
    is: "student",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
})

exports.loginSchema = Joi.object({
  email: Joi.string().required(), // Can be email or username
  password: Joi.string().required(),
})

// Assignment schemas
exports.assignmentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  published: Joi.boolean().default(false),
  totalMarks: Joi.number().required().min(0),
})

exports.submissionSchema = Joi.object({
  content: Joi.string().required(),
})

exports.gradeSchema = Joi.object({
  marks: Joi.number().required().min(0),
  feedback: Joi.string().allow("", null),
})

// User schema
exports.updateUserSchema = Joi.object({
  username: Joi.string().min(3),
  password: Joi.string().min(6),
  fullName: Joi.string(),
  email: Joi.string().email(),
  studentId: Joi.string(),
  role: Joi.string().valid("admin", "student"),
})

// Password change schema
exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
})
