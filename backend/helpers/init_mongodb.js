const mongoose = require("mongoose")
require("dotenv").config()

mongoose
  .connect(process.env.MONGODB_URL, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("mongodb connected")
  })
  .catch((err) => console.log(err.message))

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB")
})

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected")
})

// Handle application termination
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log("Mongoose connection closed due to app termination")
  process.exit(0)
})

module.exports = mongoose