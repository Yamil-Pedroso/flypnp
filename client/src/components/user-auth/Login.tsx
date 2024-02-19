import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import Profile from '../user-profile/Profile'
import { useAuth } from '../../../hooks'

import { Container } from './styles'

interface LoginProps {
  className?: string
}

const Login = ({ className }: LoginProps) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [redirect, setRedirect] = useState(false)
  const auth = useAuth() as any

  const handleFormData = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFormSubmit = async (e: any) => {
    e.preventDefault()

    const response = await auth.login(formData)
    if (response.success) {
      console.log('User logged in')
      setRedirect(true)
    } else {
      console.log('Login failed')
    }
  }

  const handleGoogleLogin = async (credential: any) => {
    const response = await auth.googleLogin(credential)
    if (response.success) {
      console.log('User logged in with Google')
      setRedirect(true)
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
        <form className="" onSubmit={handleFormSubmit}>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
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
          <a className="" href={'/register'}>
            Register now
          </a>
        </div>
      </div>
    </Container>
  )
}

export default Login
