import Joi from "joi"

export const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
})

export const registerSchema = Joi.object({
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

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const assignmentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  published: Joi.boolean().default(false),
  totalMarks: Joi.number().required().min(0),
})

export const submissionSchema = Joi.object({
  content: Joi.string().required(),
})

export const gradeSchema = Joi.object({
  marks: Joi.number().required().min(0),
  feedback: Joi.string().allow("", null),
})
