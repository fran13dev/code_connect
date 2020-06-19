import React, { Fragment } from 'react'

const NotFound = () => {
  const styling = {
    textAlign: 'center'
  }

  return (
    <Fragment>
      <h1 className='x-large text-primary' style={styling}>
        <i className='fas fa-exclamation-triangle' /> Page Not Found
      </h1>
    </Fragment>
  )
}

export default NotFound
