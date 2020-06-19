import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { deleteComment } from '../../actions/post'

const CommentItem = ({
  post_id,
  comment: { _id, text, name, avatar, user, date },
  auth,
  deleteComment
}) => {
  const handleClick = () => {}
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on: <Moment format='YYYY/MM/DD'>{date}</Moment>
        </p>
        {!auth.loading && user === auth.user.id && (
          <Fragment>
            <button onClick={handleClick} type='button' class='btn btn-danger'>
              <i class='fas fa-times' />
            </button>
          </Fragment>
        )}
      </div>
    </div>
  )
}

CommentItem.propTypes = {
  post_id: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem)
