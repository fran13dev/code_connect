import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, from, to, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{school}</h3>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
      {to ? <Moment format='YYYY/MM/DD'>{to}</Moment> : <span>present</span>}
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldofstudy}
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

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
}

export default ProfileEducation
