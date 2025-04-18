const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      required: [true, 'E-mail is required'],
      unique: true,
      trim: true,
    },
    studentId: {
      type: String,
      sparse: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(this.password, salt);
    this.password = hashedPwd;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare entered password with hashed password
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
