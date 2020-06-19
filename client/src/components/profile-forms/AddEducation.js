import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { addEducation } from '../../actions/profile'

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  })

  const [currentSchool, toggleCurrentSchool] = useState(false)

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = formData

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    addEducation(formData, history)
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any school/course that you
        have attended/completed
      </p>
      <form onSubmit={e => handleSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            value={school}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='School/Course'
            name='school'
          />
          <small className='form-text'>This is a required field</small>
        </div>
        <div className='form-group'>
          <input
            value={degree}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Degree or Certificate'
            name='degree'
          />
          <small className='form-text'>This is a required field</small>
        </div>
        <div className='form-group'>
          <input
            value={fieldofstudy}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Field Of Study'
            name='fieldofstudy'
          />
          <small className='form-text'>This is a required field</small>
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input
            value={from}
            onChange={e => handleChange(e)}
            type='date'
            name='from'
          />
          <small className='form-text'>This is a required field</small>
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              name='current'
              checked={current}
              value={current}
              onChange={() => {
                setFormData({ ...formData, current: !current })
                toggleCurrentSchool(!currentSchool)
              }}
            />{' '}
            Current School/Course
          </p>
        </div>

        <div className='form-group'>
          <h4>To Date</h4>
          <input
            value={to}
            onChange={e => handleChange(e)}
            disabled={currentSchool ? 'disabled' : ''}
            type='date'
            name='to'
          />
        </div>

        <div className='form-group'>
          <textarea
            value={description}
            onChange={e => handleChange(e)}
            name='description'
            cols='30'
            rows='5'
            placeholder='Program Description'
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link to='/dashboard' className='btn btn-light my-1'>
          Go Back
        </Link>
      </form>
    </Fragment>
  )
}

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
}

export default connect(null, { addEducation })(withRouter(AddEducation))
