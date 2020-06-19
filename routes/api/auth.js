const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  auth = require('../../middleware/auth'),
  User = require('../../models/User'),
  { check, validationResult } = require('express-validator'),
  keys = require('../../config/keys')

router.get('/', auth, async (req, res) => {
  try {
    const id = req.user.id
    // exclude password from returned user object
    const user = await User.findById(id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Login User
router.post(
  '/',
  // check if user data is valid
  [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // object that holds the current state of validation errors
    const errors = validationResult(req)
    // check if object contains error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {
      // if findOne() method conditions are same, no need repeat
      let user = await User.findOne({ email })
      // if email already exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      // check password
      const hash = user.password
      const match = await bcrypt.compare(password, hash)

      if (!match) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      // jwt payload data
      const payload = {
        user: {
          id: user.id
        }
      }

      // sign jwt token
      const secret = keys.jwt.secret
      jwt.sign(
        payload,
        secret,
        { expiresIn: 60 * 60 * 24 * 365 },
        (err, token) => {
          if (err) throw err
          res.json({
            token: token
          })
        }
      )
    } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server error')
    }
  }
)

module.exports = router
