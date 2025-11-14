import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/button/filled-button.js'
import '@material/web/progress/circular-progress.js'
import { loginUser, clearError } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch'
import './Login.css'

const MdOutlinedTextField = 'md-outlined-text-field' as any
const MdFilledButton = 'md-filled-button' as any
const MdCircularProgress = 'md-circular-progress' as any

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((state) => state.auth)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    const result = await dispatch(loginUser({ username, password }))
    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Facettenschach Admin</h1>
        <form onSubmit={handleLogin} className="login-form">
          <MdOutlinedTextField
            label="Username"
            value={username}
            onInput={(e: any) => setUsername(e.target.value)}
            disabled={loading}
            className="login-input"
          />
          <MdOutlinedTextField
            label="Password"
            type="password"
            value={password}
            onInput={(e: any) => setPassword(e.target.value)}
            disabled={loading}
            className="login-input"
          />
          {error && <p className="login-error">{error}</p>}
          <div className="login-button-wrapper">
            <MdFilledButton
              disabled={loading || !username || !password}
              className="login-button"
              onClick={handleLogin}
            >
              {loading ? 'Logging in...' : 'Login'}
            </MdFilledButton>
            {loading && <MdCircularProgress indeterminate />}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

