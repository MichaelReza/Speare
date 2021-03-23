import React from 'react'
import '../../App.css'
import './Landing.css'
import landingphoto from '../../images/landing-photo.jpg'

function Landing() {
  return (
    <>
      <div className="landing">
        <div className="landing-photo-wrap">
          <div className="landing-photo">
            <img src={landingphoto}></img>
          </div>
          </div>
        </div>
    </>
  )
}

export default Landing;