const express = require('express'),
  router = express.Router(),
  auth = require('../../middleware/auth'),
  { check, validationResult } = require('express-validator'),
  Post = require('../../models/Post'),
  User = require('../../models/User')

// create a post
router.post(
  '/',
  [
    auth,
    [
      check('text', 'This is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      res.status(400).json({ message: result.array() })
    }

    try {
      // get the user from the user model
      const id = req.user.id
      const user = await User.findById(id).select('-password')

      const newPost = new Post({
        user: id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      })

      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: 'desc' })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// get post by id
router.get('/:post_id', auth, async (req, res) => {
  try {
    const id = req.params.post_id
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.json(post)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' })
    }
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.delete('/:post_id', auth, async (req, res) => {
  try {
    const id = req.params.post_id
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // check if user is same user that created the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    post.remove()

    res.json({ message: 'Post removed' })
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' })
    }
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post_id = req.params.post_id,
      post = await Post.findById(post_id),
      user_id = req.user.id

    // check if user already liked the post
    if (
      post.likes.filter(like => like.user.toString() === user_id).length > 0
    ) {
      return res.status(400).json({ message: 'Post already liked' })
    }

    post.likes.unshift({ user: user_id })
    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post_id = req.params.post_id,
      post = await Post.findById(post_id),
      user_id = req.user.id

    // check if user already liked the post
    if (
      post.likes.filter(like => like.user.toString() === user_id).length === 0
    ) {
      return res.status(400).json({ message: 'Post has not yet been liked' })
    }

    const removeIndex = post.likes.map(like => like.user).indexOf(user_id)
    post.likes.splice(removeIndex, 1)

    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// create a comment
router.post(
  '/comment/:post_id',
  [
    auth,
    [
      check('text', 'This is a required field')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      res.status(400).json({ message: result.array() })
    }

    try {
      // get the user from the user model
      const user_id = req.user.id,
        user = await User.findById(user_id).select('-password'),
        post_id = req.params.post_id

      const newComment = {
        user: user_id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      }

      const post = await Post.findById(post_id)
      post.comments.unshift(newComment)

      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post_id = req.params.post_id,
      comment_id = req.params.comment_id,
      user_id = req.user.id

    const post = await Post.findById(post_id)
    const comment = post.comments.find(comment => comment.id === comment_id)

    // check if comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' })
    }

    // check user
    if (comment.user.toString() !== user_id) {
      return res.status(401).json({ message: 'User not authorized' })
    }

    const removeIndex = post.comments
      .map(comment => comment.user)
      .indexOf(user_id)
    post.comments.splice(removeIndex, 1)

    await post.save()
    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
