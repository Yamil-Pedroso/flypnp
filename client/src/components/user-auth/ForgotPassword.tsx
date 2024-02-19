import { Container } from './styles'

const ForgotPassword = () => {
  return (
    <Container>
      <h1>Forgot Password</h1>
      <div className="form-wrapper">
        <form action="">
          <input type="email" placeholder="forgot password" />

          <button type="submit">Send Email</button>
        </form>
      </div>
    </Container>
  )
}

export default ForgotPassword
