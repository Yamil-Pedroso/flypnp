/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { FaHouseUser } from 'react-icons/fa6'
import { RiMenuUnfoldLine } from 'react-icons/ri'
import { TbWorld } from 'react-icons/tb'
import { IoMdCloseCircle } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5'
import { useAuth } from '../../../../hooks'
import { useNotifications } from '../../../../hooks'
import Login from '../../user-auth/Login'
import Register from '../../user-auth/Register'

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userLoginOpen, setUserLoginOpen] = useState(false)
  const [userRegisterOpen, setUserRegisterOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const auth = useAuth() as any
  const { user, logout } = auth
  const notis = useNotifications() as any

  console.log('notifications', notis.notifications.length)

  const handleMenuIconClick = () => {
    setMenuOpen(!menuOpen)
  }

  const handleMenuLoginIconClick = () => {
    setUserLoginOpen(!userLoginOpen)
    setUserRegisterOpen(false)
  }

  const handleMenuRegisterIconClick = () => {
    setUserRegisterOpen(!userRegisterOpen)
    setUserLoginOpen(false)
  }

  const handleUserMenuIconClick = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector('.user-menu-wrapper')
    if (wrapper && !wrapper.contains(e.target as Node)) {
      setUserMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickOutside)
    return () => {
      document.removeEventListener('click', clickOutside)
    }
  }, [])

  const hangleLogout = async (e: any) => {
    e.preventDefault()
    const response = await logout()
    if (response.success) {
      console.log('logout success')
    } else {
      console.log('logout failed')
    }
  }

  return (
    <div className="user-menu-container">
      <div className="user-menu-item">
        <TbWorld onClick={handleMenuIconClick} className="world-icon" />
      </div>
      <div className={`menu-translation-region-wrapper ${menuOpen && 'show'}`}>
        <div className="menu-translation-region-content">
          <div className="close-icon-wrapper">
            <IoCloseSharp
              onClick={handleMenuIconClick}
              className="close-icon-translate"
            />
          </div>
          <h2>Translation & Region & Currency</h2>
        </div>
      </div>
      <div className="user-menu-content">
        <div onClick={handleUserMenuIconClick} className="user-menu-wrapper">
          <div className="user-menu-item">
            <RiMenuUnfoldLine className="menu-lines" />
          </div>
          {user ? (
            <div className="user-menu-item">
              {notis.notifications.length > 0 && (
                <span className="notification-count">
                  <p>{notis.notifications.length}</p>
                </span>
              )}
              <img
                src={user.avatar}
                alt="user-avatar"
                className="user-avatar"
              />
            </div>
          ) : (
            <div className="user-menu-item">
              <FaHouseUser className="user-icon" />
            </div>
          )}
        </div>
        <div className={`user-menu-box ${userMenuOpen && 'show'}`}>
          <div className="user-menu-box-content">
            {user ? (
              <ul>
                <li>
                  <a href="/notifications">Notis</a>
                </li>
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a href="/register">Trips</a>
                </li>
                <li>
                  <a href="#">Wishlists</a>
                </li>
                <hr
                  style={{ margin: '0.5rem 0', border: '.02px solid #dedede' }}
                />
                <li>
                  <a href="#">Flypnp our home</a>
                </li>
                <li>
                  <a href="#">Messages</a>
                </li>
                <hr
                  style={{ margin: '0.5rem 0', border: '.02px solid #dedede' }}
                />
                <li>
                  <a href="#">Gift cards</a>
                </li>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#" onClick={hangleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            ) : (
              <ul>
                <li onClick={handleMenuLoginIconClick}>
                  <a href="#">Login</a>
                </li>
                <li onClick={handleMenuRegisterIconClick}>
                  <a href="#">Sign up</a>
                </li>
                <hr
                  style={{
                    margin: '0.5rem 0',
                    border: '.02px solid #dedede',
                  }}
                />
                <li>
                  <a href="/register">Gift cards</a>
                </li>
                <li>
                  <a href="/register">Flypnp your home</a>
                </li>
                <li>
                  <a href="/register">Help center</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div
        className={`user-login-form-wrapper ${userLoginOpen && 'show-login'}`}
      >
        <div className="form-content">
          <Login
            closeUserForm={handleMenuLoginIconClick}
            changeToRegister={handleMenuRegisterIconClick}
          />
        </div>
      </div>
      <div
        className={`user-register-form-wrapper ${
          userRegisterOpen && 'show-register'
        }`}
      >
        <div className="form-content">
          <Register
            closeUserForm={handleMenuRegisterIconClick}
            changeToLogin={handleMenuLoginIconClick}
          />
        </div>
      </div>
    </div>
  )
}

export default UserMenu
