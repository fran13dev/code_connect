import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({
  experience: { title, company, from, to, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
      {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : <span>present</span>}
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      {description && (
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      )}
    </div>
  )
}

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
}

export default ProfileExperience
