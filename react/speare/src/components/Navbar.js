import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './css/Navbar.css'
import logo from '../assets/images/logo.png'

function Navbar() {
  const [click, setClick] = useState(false)

  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className='logo-container'>
            <div className='logo'>
              <img src={logo}></img>
              <h2>speare</h2>
            </div>
          </div>
          <ul className='nav-menu'>
            <li className='nav-item'>
              <Link to='/' className='nav-link'>
                home
              </Link>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href="https://github.com/MichaelReza/Speare" target="_blank" rel="noreferrer">
                documentation
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar
