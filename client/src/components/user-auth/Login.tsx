import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import Profile from '../user-profile/Profile'
import { useAuth } from '../../../hooks'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [redirect, setRedirect] = useState(false)
  const auth = useAuth() as any
  const { user } = auth

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

  if (redirect) {
    return <Navigate to="/" />
  }

  //if (user) {
  //  return <Navigate to="/profile" />
  //}

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl">Login</h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
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

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="h-0 w-1/2 border-[1px]"></div>
          <p className="small -mt-1">or</p>
          <div className="h-0 w-1/2 border-[1px]"></div>
        </div>

        {/* Google login button */}
        <div className="flex h-[50px] justify-center">
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

        <div className="py-2 text-center text-gray-500">
          Don't have an account yet?{' '}
          <Link className="text-black underline" to={'/register'}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
