import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import { useAuth } from '../../../hooks'

import { Container } from './styles'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [redirect, setRedirect] = useState(false)
  const auth = useAuth() as any

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await auth.register(formData)
    if (response.success) {
      console.log('User registered')
      setRedirect(true)
    } else {
      console.log(
        "Couldn't register user, this user may already exist or there was an error",
      )
    }
  }

  const handleGoogleLogin = async (credential: any) => {
    const response = await auth.googleLogin(credential)
    if (response.success) {
      setRedirect(true)
    } else {
      console.log(response.message)
    }
  }

  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <Container>
      <div className="form-wrapper">
        <h1>Register</h1>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            placeholder="John Doe"
            onChange={handleFormData}
          />

          <input
            type="email"
            name="email"
            id="email"
            placeholder="youremail@email.conm"
            value={formData.email}
            onChange={handleFormData}
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleFormData}
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
          <Link className="" to={'/login'}>
            Login
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default Register
