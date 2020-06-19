import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { addComment } from '../../actions/post'
import { connect } from 'react-redux'

const CommentForm = ({ post_id, addComment }) => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    addComment(post_id, { text })
    setText('')
  }
  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Comment</h3>
      </div>
      <form className='form my-1' onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          name='text'
          cols='30'
          rows='5'
          placeholder='Comment on this post'
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  )
}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
}

export default connect(null, { addComment })(CommentForm)
