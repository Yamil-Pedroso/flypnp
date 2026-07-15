import Register from '../components/user-auth/Register'

const RegisterPage = () => {
  return (
    <>
      <Register closeUserForm={() => undefined} changeToLogin={() => undefined} />
    </>
  )
}

export default RegisterPage
