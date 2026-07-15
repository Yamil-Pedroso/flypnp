import Login from '../components/user-auth/Login'

const LoginPage = () => {
  return (
    <>
      <Login closeUserForm={() => undefined} changeToRegister={() => undefined} />
    </>
  )
}

export default LoginPage
