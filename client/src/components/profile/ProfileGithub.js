import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import { getGitHub } from '../../actions/profile'
import { connect } from 'react-redux'

const ProfileGithub = ({ profile: { repos }, username, getGitHub }) => {
  useEffect(() => {
    getGitHub(username)
  }, [username, getGitHub])

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>
        <i className='fab fa-github'></i> Github Repositories
      </h2>

      {repos === null ? (
        <Spinner />
      ) : (
        repos.map((repo, index) => (
          <div key={index} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repo.watchers_count}
                </li>
                <li className='badge badge-light'>Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

ProfileGithub.propTypes = {
  profile: PropTypes.object.isRequired,
  getGitHub: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getGitHub })(ProfileGithub)
