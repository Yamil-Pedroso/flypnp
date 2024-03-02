/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom'
import { trending } from '../../data/trending'
import { UserProfileContainer } from './styles'
import UpdateProfile from '../user-auth/UpdateProfile'

import { Avatar, AvatarFallback, AvatarImage } from './user-avatar/Avatar'
import { FaCheck } from 'react-icons/fa6'
import { TiCamera } from 'react-icons/ti'
import { GrAchievement } from 'react-icons/gr'
import { GiAchievement } from 'react-icons/gi'
import { FaAward } from 'react-icons/fa6'
import { RiAwardFill } from 'react-icons/ri'
import { FaGithub, FaSquareGitlab, FaLinkedin } from 'react-icons/fa6'
import { CgWebsite } from 'react-icons/cg'
//import { Button } from './button/Button'

import { useAuth } from '../../../hooks'
import { LogOut } from 'lucide-react'

const Profile = () => {
  //const { places } = usePlaces() as any
  //const [myPlaces, setMyPlaces] = useState<PlacesProps[]>([])
  const auth = useAuth() as any
  const { user, logout, updateUser } = auth
  const [userAvatar, setUserAvatar] = useState(user?.avatar)
  const [userUpdateProfileOpen, setUserUpdateProfileOpen] = useState(false)
  const [redirect, setRedirect] = useState(null)
  const [time, setTime] = useState(new Date())
  const navigate = useNavigate()

  const handleClickBtnUpdateProfileToOpen = () => {
    setUserUpdateProfileOpen(!userUpdateProfileOpen)
  }

  useEffect(() => {
    const update = () => {
      setTime(new Date())
    }
    const intervalId = setInterval(update, 1000)

    return () => clearInterval(intervalId)
  }, [])

  let { subpage } = useParams()
  if (!subpage) {
    subpage = 'profile'
  }

  const handleLogout = async () => {
    const response = await logout()
    if (response.success) {
      console.log('logout success')
      navigate('/')
    } else {
      console.log('logout failed')
    }
  }

  if (!user && !redirect) {
    return <Navigate to="/profile" />
  }

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setUserAvatar(reader.result as string)
    }

    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('avatar', file)

    const response = await updateUser(formData, user._id)
    if (response.success) {
      console.log('Avatar updated')
    } else {
      console.log('Avatar update failed')
    }
  }

  //if (redirect) {
  //  return <Navigate to={redirect} />
  //}

  return (
    <UserProfileContainer>
      {subpage === 'profile' && (
        <div className="user-profile-wrapper">
          <div className="user-content">
            <Avatar>
              <div className="active-green-dot">
                <TiCamera
                  onClick={() =>
                    document.getElementById('avatar-file')?.click()
                  }
                  size={22}
                  style={{ cursor: 'pointer' }}
                />
                <input
                  type="file"
                  name="avatar"
                  id="avatar-file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
              {user.avatar ? (
                <div className="user-avatar-img">
                  <AvatarImage
                    src={userAvatar ? userAvatar : user.avatar}
                    className="object-cover"
                    alt="user-avatar"
                  />
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
              ) : (
                <AvatarImage
                  src="https://res.cloudinary.com/ddgf7ijdc/image/upload/v1706787809/yami_lil00v.jpg"
                  className="object-cover"
                />
              )}

              <AvatarFallback>{user.name.slice([0], [1])}</AvatarFallback>
            </Avatar>
            <div className="user-desc">
              <p className="text-gray-600">{user.name}</p>
              <span className="text-gray-600">{'Guest'}</span>
            </div>

            <div className="activities-wrapper">
              <div className=" acti acti-1">
                <span>5</span>
                <span>Places</span>
              </div>
              <div className=" acti acti-2">
                <span>20</span>
                <span>Reviews</span>
              </div>
              <div className=" acti acti-3">
                <span>4</span>
                <span>Booked</span>
              </div>
            </div>

            <div className="email-checked-wrapper">
              <FaCheck />
              <span>Verified email</span>
            </div>
            <div className="edit-logout-wrapper">
              <a
                href="#"
                onClick={handleClickBtnUpdateProfileToOpen}
                className="edit-profile-btn"
              >
                Edit profile
              </a>

              <button onClick={handleLogout} className="logout-btn">
                <LogOut />
                Logout
              </button>
            </div>
          </div>

          <div className="user-profile-right">
            <div className="img-profile-wrapper">
              <p>JOURNEY</p>
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="user"
              />
            </div>

            <div className="user-more">
              <div className="collection-places-wrapper">
                <div className="places-collection">
                  <p>Place collections</p>
                  <div className="places-collection-wrapper">
                    {trending.slice(0, 5).map((place) => (
                      <div key={place.id} className="places-collection-cont">
                        <Link to={`/place/${place.category}/${place.id}`}>
                          <img src={`${place.photos?.[0]}`} alt="place" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="favorites-places">
                  <p>Favorite place</p>
                  {trending.slice(7, 8).map((place) => (
                    <div className="favorite-places-wrapper">
                      <div key={place.id} className="favorites-places-cont">
                        <Link to={`/place/${place.category}/${place.id}`}>
                          <img src={`${place.photos?.[0]}`} alt="place" />
                        </Link>
                      </div>

                      <div className="desc">
                        <Link to={`/place/${place.category}/${place.id}`}>
                          {place.title}
                        </Link>

                        <button>Explore</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="user-bio">
                <h2>BIOGRAPHY</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.
                </p>

                <h2 className="website">WEBSITE</h2>
                <p>www.journey.com</p>

                <div className="achievement-wrapper">
                  <h2 className="achievement">ACHIEVEMENT</h2>
                  <div className="achievement-cont">
                    <div className="achievement-wrapper">
                      <GrAchievement size={24} className="achievement-icon" />
                      {/*<span>Superhost</span>*/}
                    </div>
                    <div className="achievement-wrapper">
                      <GiAchievement size={24} className="achievement-icon" />
                      {/*<span>Explorer</span> */}
                    </div>
                    <div className="achievement-wrapper">
                      <FaAward size={24} className="achievement-icon" />
                      {/*<span>Great Guest</span> */}
                    </div>
                    <div className="achievement-wrapper">
                      <RiAwardFill size={24} className="achievement-icon" />
                      {/*<span>Great Host</span> */}
                    </div>
                  </div>
                </div>

                <div className="local-time">
                  <p>ZURICH, SWITZERLAND</p>
                  {time.toLocaleTimeString()}
                </div>

                <div className="user-social">
                  <div className="social-wrapper">
                    <div className="social-cont">
                      <FaGithub size={24} />
                    </div>
                    <div className="social-cont">
                      <FaSquareGitlab size={24} />
                    </div>
                    <div className="social-cont">
                      <FaLinkedin size={24} />
                    </div>
                    <div className="social-cont">
                      <CgWebsite size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*{subpage === 'places' && <Places />}*/}
      <div
        className={`user-update-profile-wrapper ${
          userUpdateProfileOpen && 'show-update-profile'
        }`}
      >
        <div className="form-upprofile-content">
          <UpdateProfile closeUserForm={handleClickBtnUpdateProfileToOpen} />
        </div>
      </div>
    </UserProfileContainer>
  )
}

export default Profile
