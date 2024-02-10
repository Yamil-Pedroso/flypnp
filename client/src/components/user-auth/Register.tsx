import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import { useAuth } from '../../../hooks'

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px',
      }}
    >
      <h1>Register</h1>
      <form
        action=""
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div>
          <label htmlFor="firstName">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleFormData}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleFormData}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleFormData}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="mb-4 flex w-full items-center gap-4">
        <div className="h-0 w-1/2 border-[1px]"></div>
        <p className="small -mt-1">or</p>
        <div className="h-0 w-1/2 border-[1px]"></div>
      </div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin(credentialResponse)
        }}
        onError={() => console.log('Google login failed')}
      />

      <div className="py-2 text-center text-gray-500">
        Already a member?
        <Link className="text-black underline" to={'/login'}>
          Login
        </Link>
      </div>
    </div>
  )
}

export default Register
