const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    marks: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "graded", "late"],
      default: "submitted",
    },
  },
  { timestamps: true },
)

// Ensure a student can only submit once per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

module.exports = mongoose.model("Submission", submissionSchema)