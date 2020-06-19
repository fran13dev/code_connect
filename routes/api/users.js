const express = require('express'),
  router = express.Router(),
  gravatar = require('gravatar'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  { check, validationResult } = require('express-validator'),
  User = require('../../models/User'),
  keys = require('../../config/keys')

// Register User
router.post(
  '/',
  // check if user data is valid
  [
    check('name', 'Please enter your name')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check(
      'password',
      'Password needs to be at least 6 characters long'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // object that holds the current state of validation errors
    const result = validationResult(req)
    // check if object contains error
    if (!result.isEmpty()) {
      return res.status(400).json({ result: result.array() })
    }

    const { name, email, password } = req.body
    try {
      // if findOne() method conditions are same, no need repeat
      let user = await User.findOne({ email })
      // if email already exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Email already exists' }] })
      }

      const avatar = gravatar.url(email, {
        s: '200',
        d: 'retro',
        r: 'pg'
      })

      // create new user model
      user = new User({
        name,
        email,
        password,
        avatar
      })

      // hash password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // save user to the database
      await user.save()

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
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
