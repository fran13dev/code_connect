import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { addExperience } from '../../actions/profile'

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  })

  const [currentJob, toggleCurrentJob] = useState(false)

  const { title, company, location, from, to, current, description } = formData

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    addExperience(formData, history)
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any developer positions that
        you have had in the past
      </p>
      <form onSubmit={e => handleSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            value={title}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Job Title'
            name='title'
          />
          <small className='form-text'>This is a required field</small>
        </div>
        <div className='form-group'>
          <input
            value={company}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Company'
            name='company'
          />
          <small className='form-text'>This is a required field</small>
        </div>
        <div className='form-group'>
          <input
            value={location}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Location'
            name='location'
          />
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
                toggleCurrentJob(!currentJob)
              }}
            />{' '}
            Current Job
          </p>
        </div>

        <div className='form-group'>
          <h4>To Date</h4>
          <input
            value={to}
            onChange={e => handleChange(e)}
            disabled={currentJob ? 'disabled' : ''}
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
            placeholder='Job Description'
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

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
}

export default connect(null, { addExperience })(withRouter(AddExperience))
