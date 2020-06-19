const jwt = require('jsonwebtoken'),
  keys = require('../config/keys')

module.exports = (req, res, next) => {
  // part of the header
  const token = req.header('x-auth-token')
  if (!token) {
    // 401 = not authorized
    return res.status(401).json({
      message: 'No token, authorization denied'
    })
  }

  // jwt verify token
  try {
    const secret = keys.jwt.secret
    // decode (verify) the token
    const decoded = jwt.verify(token, secret)

    // set value to req.user object, access later
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({
      message: 'Token is not valid'
    })
  }
}
