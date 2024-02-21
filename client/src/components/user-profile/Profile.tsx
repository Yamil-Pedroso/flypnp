/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Navigate, useParams, useNavigate, Link } from 'react-router-dom'
import { trending } from '../../data/trending'
import { UserProfileContainer } from './styles'

import { Avatar, AvatarFallback, AvatarImage } from './user-avatar/Avatar'
import { FaCheck } from 'react-icons/fa6'
import { TiCamera } from 'react-icons/ti'
//import { Button } from './button/Button'

import { useAuth } from '../../../hooks'
import { LogOut } from 'lucide-react'
import EditeProfileDialog from './edit-profile-dialog/EditeProfileDialog'

const Profile = () => {
  const auth = useAuth() as any
  const { user, logout } = auth
  const [redirect, setRedirect] = useState(null)
  const navigate = useNavigate()

  console.log('user', user)

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
                <TiCamera size={22} />
              </div>
              {user.avatar ? (
                <div className="user-avatar-img">
                  <AvatarImage src={user.avatar} />
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
              <p className="text-gray-600">{user.name} Pedroso</p>
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
              {/*<EditeProfileDialog />*/}

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
                  <p>Favorites places</p>
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
              </div>
            </div>
          </div>
        </div>
      )}
      {/*{subpage === 'places' && <Places />}*/}
    </UserProfileContainer>
  )
}

export default Profile
