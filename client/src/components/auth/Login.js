import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// redux
import { connect } from 'react-redux'
import { login } from '../../actions/auth'

// destructure so that { login } instead of props.login
const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = formData
  const handleChange = event =>
    setFormData({ ...formData, [event.target.name]: event.target.value })

  const handleSubmit = event => {
    event.preventDefault()
    login(email, password)
  }

  // redirect if isAuthenticated is true
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into Your Account
      </p>
      <form className='form' onSubmit={event => handleSubmit(event)}>
        <div className='form-group'>
          <input
            value={email}
            onChange={event => handleChange(event)}
            type='email'
            placeholder='Email Address'
            name='email'
          />
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
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)
