import { useNavigate } from 'react-router-dom'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  const navigate = useNavigate()

  const handleSubmitAndNavigate = async (event) => {
    event.preventDefault()

    try {
      await handleSubmit(event)
      navigate('/')
    } catch (error) {
      console.error('Login and navigation failed', error)
    }
  }

  return (
    <div>
      <h1>Log in to application</h1>
      <form onSubmit={handleSubmitAndNavigate}>
        <div>
          <label>
            username
            <input
              type='text'
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type='password'
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type='submit'>log in</button>
      </form>
    </div>
  )
}

export default LoginForm
