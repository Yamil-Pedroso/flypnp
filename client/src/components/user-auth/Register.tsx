/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import { useAuth } from '../../../hooks'
import { IoCloseSharp } from 'react-icons/io5'
import { Container } from './styles'

interface RegisterProps {
  closeUserForm: () => void
  changeToLogin: () => void
}

const Register = ({ closeUserForm, changeToLogin }: RegisterProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  })
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    password: false,
    avatar: false,
  })

  const [redirect, setRedirect] = useState(false)
  const auth = useAuth() as any

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type !== 'file') {
      const { name, value } = e.target

      setFormData({
        ...formData,
        [name]: value,
      })

      if (setFormErrors) {
        setFormErrors({ ...formErrors, [name]: false })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.avatar
    ) {
      setFormErrors({
        name: !formData.name,
        email: !formData.email,
        password: !formData.password,
        avatar: !formData.avatar,
      })
      console.log('Register failed: Missing fields')
      return
    }

    const response = await auth.register(formData)
    if (response.success) {
      console.log('User registered')
      //setRedirect(true)
      closeUserForm()
    } else {
      console.log(
        "Couldn't register user, this user may already exist or there was an error",
      )
    }
  }

  const handleCloseForm = () => {
    closeUserForm()
  }

  const handleGoogleLogin = async (credential: any) => {
    const response = await auth.googleLogin(credential)
    if (response.success) {
      setRedirect(true)
    } else {
      console.log(response.message)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        avatar: e.target.files[0] as any,
      })
    }
  }

  //if (redirect) {
  //  return <Navigate to="/" />
  //}

  return (
    <Container>
      <div className="form-wrapper">
        <h1>Register</h1>
        <IoCloseSharp className="close-icon" onClick={handleCloseForm} />
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            placeholder="John Doe"
            onChange={handleFormData}
            className={formErrors.name ? 'error-border' : ''}
          />

          <input
            type="email"
            name="email"
            id="email"
            placeholder="youremail@email.conm"
            value={formData.email}
            onChange={handleFormData}
            className={formErrors.email ? 'error-border' : ''}
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleFormData}
            className={formErrors.password ? 'error-border' : ''}
          />

          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button type="submit">Register</button>
        </form>

        <div className="or-wrapper">
          <p className="">or</p>
        </div>

        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse)
            }}
            onError={() => console.log('Google login failed')}
            width="350"
          />
        </div>

        <div className="question-btn-wrapper">
          Already a member?
          <p
            className="link"
            onClick={() => {
              changeToLogin()
            }}
          >
            Login
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Register
