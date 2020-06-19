const express = require('express'),
  router = express.Router(),
  { check, validationResult } = require('express-validator'),
  request = require('request'),
  auth = require('../../middleware/auth'),
  User = require('../../models/User'),
  Profile = require('../../models/Profile'),
  Post = require('../../models/Post'),
  keys = require('../../config/keys')

// get an already created profile, not the same as a username and password
router.get('/me', auth, async (req, res) => {
  try {
    const id = req.user.id
    const profile = await Profile.findOne({ user: id }).populate(
      'user',
      'name avatar'
    )
    // if profile doesn't exist
    if (!profile) {
      return res.status(400).json({
        message: 'There is no profile for this user'
      })
    }

    // send profile
    return res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// comma separated values as middleware inside []
// create profile
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is a mandatory field')
        .not()
        .isEmpty(),
      check('skills', 'Skills is a mandatory field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() })
    }

    // destructure user input fields
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    } = req.body

    // create profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (status) profileFields.status = status
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    if (bio) profileFields.bio = bio
    if (githubusername) profileFields.githubusername = githubusername

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      const id = req.user.id
      let profile = await Profile.findOne({ user: id })

      if (profile) {
        // if profile exists, update the profile
        profile = await Profile.findOneAndUpdate(
          { user: id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }

      // if profile doesn't exists, create the profile
      profile = new Profile(profileFields)

      // save to the db
      await profile.save()
      return res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// get all dev profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate({
      path: 'user',
      select: 'name avatar'
    })
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get dev profile by user id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate({ path: 'user', select: 'name avatar' })
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' })
    }
    res.json(profile)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Profile not found' })
    }
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// delete user, the profile and posts
router.delete('/', auth, async (req, res) => {
  try {
    // removes posts
    await Post.deleteMany({ user: req.user.id })
    // remove profile
    await Profile.findOneAndDelete({ user: req.user.id })
    // remove user
    await User.findOneAndDelete({ _id: req.user.id })
    res.json({ message: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// create profile experience
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'This is a required field')
        .not()
        .isEmpty(),
      check('company', 'This is a required field')
        .not()
        .isEmpty(),
      check('from', 'This is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() })
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      // the experience prop of the profile object
      profile.experience.unshift(newExperience)
      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// delete profile experience
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// create profile education
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'This is a required field')
        .not()
        .isEmpty(),
      check('degree', 'This is a required field')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'This is a required field')
        .not()
        .isEmpty(),
      check('from', 'This is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      // the education prop of the profile object
      profile.education.unshift(newEducation)
      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// delete profile education
router.delete('/education/:ed_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.ed_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// read about the github api
router.get('/github/:username', async (req, res) => {
  try {
    const id = keys.github.clientId
    const secret = keys.github.clientSecret
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${id}&client_secret=${secret}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }
    request(options, (error, response, body) => {
      if (error) {
        console.error(error)
      }
      if (response.statusCode !== 200) {
        res.status(404).json({ message: 'GitHub profile not found' })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
