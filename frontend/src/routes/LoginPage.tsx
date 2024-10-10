import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { useAuthContext } from '../context/useContext'

import './css/LoginPage.css'

interface AuthUser {
  email: string
  password: string
  firstName: string
  lastName: string
}

export default function LoginPage() {
  const { bearerToken, login, register } = useAuthContext()
  const navigate = useNavigate()

  const [user, setUser] = useState<AuthUser>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [emailEntered, setEmailEntered] = useState(false)
  const [userExisted, setUserExisted] = useState(false)
  const [message, setMessage] = useState('')

  const checkUser = () => {
    // TODO: call from API
    setUserExisted(true)
  }

  const handleEmailEntered = (event: React.FormEvent) => {
    event.preventDefault()
    setEmailEntered(true)
    checkUser()
  }

  const handleBack = () => {
    setMessage('')
    setEmailEntered(false)
    setUserExisted(false)
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    const response = await login(user.email, user.password)
    if (response) {
      setMessage('')
      navigate('/profile')
      return
    }
    setMessage('wrong password, please try again')
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    const response = await register(
      user.email,
      user.password,
      user.firstName,
      user.lastName
    )
    if (response) {
      setMessage('')
      navigate('/profile')
      return
    }
    setMessage('something went wrong, please try again')
  }

  useEffect(() => {
    if (bearerToken) {
      navigate('/profile')
    }
  }, [bearerToken, navigate])

  return (
    <>
      <HeaderBar />
      <div className="login-page">
        <section className="login-body">
          {!emailEntered && (
            <div>
              <h2>Login or Create your Account</h2>
              <form onSubmit={handleEmailEntered}>
                <div className="input-wrapper">
                  <label htmlFor="email">Enter your WUSTL email</label>
                  <input
                    type="email"
                    value={user.email}
                    pattern=".+@wustl\.edu"
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <button type="submit">Continue</button>
              </form>
            </div>
          )}
          {emailEntered && !userExisted && (
            <div>
              <h2>Create your Account</h2>
              <form onSubmit={handleRegister}>
                <div className="input-wrapper">
                  <label htmlFor="email">Email</label>
                  <input type="email" value={user.email} disabled />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="password">Create a Password</label>
                  <input
                    type="password"
                    minLength={8}
                    value={user.password}
                    required
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="first-name">First Name</label>
                  <input
                    type="text"
                    value={user.firstName}
                    required
                    onChange={(e) =>
                      setUser((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="last-name">Last Name</label>
                  <input
                    type="text"
                    value={user.lastName}
                    required
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                </div>
                <div className="action-btns">
                  <button type="button" onClick={handleBack}>
                    Back
                  </button>
                  <button type="submit">Sign Up</button>
                </div>
              </form>
            </div>
          )}
          {emailEntered && userExisted && (
            <div>
              <h2>Welcome back!</h2>
              <form onSubmit={handleLogin}>
                <div className="input-wrapper">
                  <label htmlFor="email">Email</label>
                  <input type="email" value={user.email} disabled />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="password">Enter your Password</label>
                  <input
                    type="password"
                    minLength={8}
                    value={user.password}
                    required
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                </div>
                <div className="action-btns">
                  <button type="button" onClick={handleBack}>
                    Back
                  </button>
                  <button type="submit">Login</button>
                </div>
              </form>
            </div>
          )}
        </section>
        <div className="login-message">{message}</div>
      </div>
      <FooterBar />
    </>
  )
}
