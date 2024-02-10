import { useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'

import AccountNav from './user-account-nav/AccountNav'
import { Avatar, AvatarFallback, AvatarImage } from './user-avatar/Avatar'
//import { Button } from './button/Button'

import Places from './user-places/Places'
import { useAuth } from '../../../hooks'
import { LogOut, Mail, Text } from 'lucide-react'
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

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="">
          {/* avatar */}
          <div className="">
            <Avatar>
              {user.avatar ? (
                <AvatarImage src={user.avatar} style={{ width: '5rem' }} />
              ) : (
                <AvatarImage
                  src="https://res.cloudinary.com/ddgf7ijdc/image/upload/v1706787809/yami_lil00v.jpg"
                  className="object-cover"
                />
              )}

              <AvatarFallback>{user.name.slice([0], [1])}</AvatarFallback>
            </Avatar>
          </div>

          <div className="">
            {/* user details */}
            <div className="">
              <div className="">
                <Text height="18" width="18" />
                <div className="text-xl">
                  <span>Name: </span>
                  <span className="text-gray-600">{user.name}</span>
                </div>
              </div>
              <div className="">
                <Mail height="18" width="18" />
                <div className="text-xl">
                  <span>Email: </span>
                  <span className="">{user.email}</span>
                </div>
              </div>
              <p></p>
            </div>

            {/* Action buttons */}
            <div className="">
              {/* <Button varient="secondary">Edit profile</Button> */}
              <EditeProfileDialog />

              <button onClick={handleLogout}>
                <LogOut className="" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {subpage === 'places' && <Places />}
    </div>
  )
}

export default Profile
