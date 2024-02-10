import { useState, useEffect } from 'react'
import { FaHouseUser } from 'react-icons/fa6'
import { RiMenuUnfoldLine } from 'react-icons/ri'
import { TbWorld } from 'react-icons/tb'
import { IoMdCloseCircle } from 'react-icons/io'
import { useAuth } from '../../../../hooks'
import { useNotifications } from '../../../../hooks'

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const auth = useAuth() as any
  const { user, logout } = auth
  const notis = useNotifications() as any

  console.log('notifications', notis.notifications.length)

  const handleMenuIconClick = () => {
    setMenuOpen(!menuOpen)
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
        <div className="close-icon-wrapper">
          <IoMdCloseCircle
            onClick={handleMenuIconClick}
            className="close-icon"
          />
        </div>
        <h2>Translation & Region & Currency</h2>
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
                  <a href="/notifications">Messages</a>
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
                  <a href="#">Account</a>
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
                <li>
                  <a href="/login">Login</a>
                </li>
                <li>
                  <a href="/register">Sign up</a>
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
    </div>
  )
}

export default UserMenu
