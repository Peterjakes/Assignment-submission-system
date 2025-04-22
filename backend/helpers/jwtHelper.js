const JWT = require("jsonwebtoken")
const createError = require("http-errors")

const signAccessToken = (userId, userRole) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, role: userRole }
    const secret = process.env.JWT_SECRET
    const options = {
      expiresIn: "1h",
      issuer: "assignment-system",
      audience: userId,
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err.message)
        reject(createError.InternalServerError())
        return
      }
      resolve(token)
    })
  })
}

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized())
  const authHeader = req.headers["authorization"]
  const bearerToken = authHeader.split(" ")
  const token = bearerToken[1]
  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
      return next(createError.Unauthorized(message))
    }
    req.payload = payload
    next()
  })
}

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {}
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    const options = {
      expiresIn: "7d",
      issuer: "assignment-system",
      audience: userId,
    }
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.error(err.message)
        reject(createError.InternalServerError())
        return
      }
      resolve(token)
    })
  })
}

// Role-based access control
const restrict = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.payload.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(createError.Forbidden("Sorry! You do not have permission to perform this action."))
    }
    next()
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  restrict
}