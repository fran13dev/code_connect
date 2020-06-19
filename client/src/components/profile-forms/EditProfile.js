import React, { useState, useEffect, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createProfile, getCurrentProfile } from '../../actions/profile'

const EditProfile = ({
  createProfile,
  getCurrentProfile,
  history,
  profile: { profile, loading }
}) => {
  const [formData, setFormData] = useState({
    status: '',
    company: '',
    website: '',
    location: '',
    skills: '',
    bio: '',
    githubusername: '',
    youtube: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: ''
  })

  const [displaySocial, toggleSocial] = useState(false)

  useEffect(() => {
    getCurrentProfile()

    setFormData({
      company: loading || !profile.company ? '' : profile.company,
      website: loading || !profile.website ? '' : profile.website,
      location: loading || !profile.location ? '' : profile.location,
      status: loading || !profile.status ? '' : profile.status,
      skills: loading || !profile.skills ? '' : profile.skills.join(','),
      githubusername:
        loading || !profile.githubusername ? '' : profile.githubusername,
      bio: loading || !profile.bio ? '' : profile.bio,
      twitter: loading || !profile.social ? '' : profile.social.twitter,
      facebook: loading || !profile.social ? '' : profile.social.facebook,
      linkedin: loading || !profile.social ? '' : profile.social.linkedin,
      youtube: loading || !profile.social ? '' : profile.social.youtube,
      instagram: loading || !profile.social ? '' : profile.social.instagram
    })
  }, [loading, getCurrentProfile])

  const {
    status,
    company,
    website,
    location,
    skills,
    bio,
    githubusername,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram
  } = formData

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    createProfile(formData, history, true)
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Create Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Please add some information to make your
        profile stand out
      </p>
      <small>* required fields</small>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <select value={status} onChange={e => handleChange(e)} name='status'>
            <option value='0'>Select Professional Status</option>
            <option value='Junior Developer'>Junior Developer</option>
            <option value='Senior Developer'>Senior Developer</option>
            <option value='Manager'>Manager</option>
            <option value='Student'>Student</option>
            <option value='Instructor'>Instructor</option>
            <option value='Intern'>Intern</option>
            <option value='Other'>Other</option>
          </select>
          <small className='form-text'>
            * What's your current role at the company
          </small>
        </div>
        <div className='form-group'>
          <input
            value={company}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Company'
            name='company'
          />
          <small className='form-text'>The company you're employed at</small>
        </div>
        <div className='form-group'>
          <input
            value={website}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Website'
            name='website'
          />
          <small className='form-text'>The company's website</small>
        </div>
        <div className='form-group'>
          <input
            value={location}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Location'
            name='location'
          />
          <small className='form-text'>
            City & Country suggested (eg. Cape Town, South Africa)
          </small>
        </div>
        <div className='form-group'>
          <input
            value={skills}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Skills'
            name='skills'
          />
          <small className='form-text'>
            * Please use comma separated values (eg. HTML, CSS, JavaScript)
          </small>
        </div>
        <div className='form-group'>
          <input
            value={githubusername}
            onChange={e => handleChange(e)}
            type='text'
            placeholder='Github Username'
            name='githubusername'
          />
          <small className='form-text'>
            If you want to display your latest projects and a Github link,
            include your username
          </small>
        </div>
        <div className='form-group'>
          <textarea
            value={bio}
            onChange={e => handleChange(e)}
            placeholder='A short bio of yourself'
            name='bio'
          ></textarea>
          <small className='form-text'>Tell us about yourself</small>
        </div>

        {displaySocial ? (
          <Fragment>
            <div className='my-2'>
              <button
                onClick={() => toggleSocial(!displaySocial)}
                type='button'
                className='btn btn-light'
              >
                Hide Social Network Links
              </button>
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x'></i>
              <input
                value={twitter}
                onChange={e => handleChange(e)}
                type='text'
                placeholder='Twitter URL'
                name='twitter'
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x'></i>
              <input
                value={facebook}
                onChange={e => handleChange(e)}
                type='text'
                placeholder='Facebook URL'
                name='facebook'
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x'></i>
              <input
                value={youtube}
                onChange={e => handleChange(e)}
                type='text'
                placeholder='YouTube URL'
                name='youtube'
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-linkedin fa-2x'></i>
              <input
                value={linkedin}
                onChange={e => handleChange(e)}
                type='text'
                placeholder='Linkedin URL'
                name='linkedin'
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x'></i>
              <input
                value={instagram}
                onChange={e => handleChange(e)}
                type='text'
                placeholder='Instagram URL'
                name='instagram'
              />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className='my-2'>
              <button
                onClick={() => toggleSocial(!displaySocial)}
                type='button'
                className='btn btn-light'
              >
                Add Social Network Links
              </button>
            </div>
          </Fragment>
        )}

        <input type='submit' className='btn btn-primary my-1' />
        <Link to='/dashboard' className='btn btn-light my-1'>
          Go Back
        </Link>
      </form>
    </Fragment>
  )
}

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
)
