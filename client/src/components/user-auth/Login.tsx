/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import Profile from '../user-profile/Profile'
import { useAuth } from '../../../hooks'

import { IoCloseSharp } from 'react-icons/io5'
import { Container } from './styles'

interface LoginProps {
  closeUserForm: () => void
  changeToRegister: () => void
}

const Login = ({ closeUserForm, changeToRegister }: LoginProps) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  })
  const [redirect, setRedirect] = useState(false)
  const auth = useAuth() as any

  const handleFormData = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (setFormErrors) {
      setFormErrors({ ...formErrors, [name]: false })
    }
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setFormErrors({ email: !formData.email, password: !formData.password })
      console.log('Login failed: Missing fields')
      return
    }

    const response = await auth.login(formData)
    if (response.success) {
      console.log('User logged in')
      setRedirect(true)
      closeUserForm()
    } else {
      console.log('Login failed: Invalid credentials')

      setFormErrors({ email: true, password: true })
    }
  }

  const handleCloseForm = () => {
    closeUserForm()
  }

  const handleGoogleLogin = async (credential: any) => {
    const response = await auth.googleLogin(credential)
    if (response.success) {
      console.log('User logged in with Google')
      //setRedirect(true)
    } else {
      console.log(response.message)
    }
  }

  //if (redirect) {
  //  return <Navigate to="/" />
  //}

  //if (user) {
  //  return <Navigate to="/profile" />
  //}

  return (
    <Container>
      <div className="form-wrapper">
        <h1 className="">Login</h1>

        <IoCloseSharp onClick={handleCloseForm} className="close-icon" />

        <form className="" onSubmit={handleFormSubmit}>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            className={formErrors.email ? 'error-border' : ''}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            className={formErrors.password ? 'error-border' : ''}
          />

          <button className="primary my-4">Login</button>
        </form>

        <div className="or-wrapper">
          <p className="">or</p>
        </div>

        {/* Google login button */}
        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential)
            }}
            onError={() => {
              console.log('Login Failed')
            }}
            text="continue_with"
            width="350"
          />
        </div>

        <div className="question-btn-wrapper">
          Don't have an account yet?{' '}
          <p className="link" onClick={changeToRegister}>
            Register now
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Login
