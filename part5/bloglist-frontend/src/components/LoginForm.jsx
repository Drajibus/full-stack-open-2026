import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

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
          <TextField
            label='username'
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            label='password'
            value={password}
            onChange={handlePasswordChange}
            style={{ marginLeft: 10 }}
          />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          log in
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
