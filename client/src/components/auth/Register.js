import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password, password2 } = formData
  const handleChange = event =>
    setFormData({ ...formData, [event.target.name]: event.target.value })

  const handleSubmit = event => {
    event.preventDefault()
    if (password !== password2) {
      return setAlert('Passwords do not match', 'danger')
    } else {
      register({ name, email, password })
    }
  }

  // redirect if isAuthenticated is true
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={event => handleSubmit(event)}>
        <div className='form-group'>
          <input
            value={name}
            onChange={event => handleChange(event)}
            type='text'
            placeholder='Name'
            name='name'
          />
        </div>
        <div className='form-group'>
          <input
            value={email}
            onChange={event => handleChange(event)}
            type='email'
            placeholder='Email Address'
            name='email'
          />
          <small className='form-text'>
            This site uses Gravatar for profile images
          </small>
        </div>
        <div className='form-group'>
          <input
            value={password}
            onChange={event => handleChange(event)}
            type='password'
            placeholder='Password'
            name='password'
          />
        </div>
        <div className='form-group'>
          <input
            onChange={event => handleChange(event)}
            type='password'
            placeholder='Confirm Password'
            name='password2'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register)
