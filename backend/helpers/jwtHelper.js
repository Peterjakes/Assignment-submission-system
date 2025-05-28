const JWT = require("jsonwebtoken")
const createError = require("http-errors")

module.exports = {
  signAccessToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const payload = { userId, role }
      const secret = process.env.JWT_SECRET
      const options = {
        expiresIn: "1h",
        issuer: "assignment-system",
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },

  verifyAccessToken: (req, res, next) => {
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
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = { userId }
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: "1y",
        issuer: "assignment-system",
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return reject(createError.Unauthorized())
        const userId = payload.aud
        resolve(userId)
      })
    })
  },

  restrict: (role) => {
    return (req, res, next) => {
      if (req.payload.role !== role) {
        return next(createError.Forbidden("Access denied"))
      }
      next()
    }
  },
}
