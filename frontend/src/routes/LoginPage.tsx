import { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { useAuthContext } from '../context/useContext'
import AuthAPI from '../services/AuthAPI'

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
  const [checkUserLoading, setCheckUserLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

  const checkUser = async () => {
    setCheckUserLoading(true)
    setTimeout(() => {
      AuthAPI.userExisted(user.email)
        .then((response) => {
          if (!response.exist) {
            setUserExisted(false)
            setMessage('')
          } else if (response.active) {
            setUserExisted(true)
            setMessage('')
          } else {
            setEmailEntered(false)
            setMessage('Please verify your email to continue')
          }
        })
        .finally(() => {
          setCheckUserLoading(false)
        })
    }, 100) // TODO: remove this intentional delay
  }

  const handleEmailEntered = (event: React.FormEvent) => {
    event.preventDefault()
    setEmailEntered(true)
    checkUser()
  }

  const handleBack = () => {
    setMessage('')
    setUser({ ...user, password: '', firstName: '', lastName: '' })
    setEmailEntered(false)
    setUserExisted(false)
  }

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    setLoginLoading(true)
    login(user.email, user.password)
      .then((response) => {
        if (response) {
          setMessage('')
          navigate('/dashboard')
          return
        }
        setMessage('wrong password, please try again')
      })
      .finally(() => {
        setLoginLoading(false)
      })
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    setSignupLoading(true)
    register(user.email, user.password, user.firstName, user.lastName)
      .then((response) => {
        setSignupLoading(false)
        if (response) {
          setMessage('Please check your email to verify your account')
          setEmailEntered(false)
          setUserExisted(false)
          setUser({ ...user, password: '', firstName: '', lastName: '' })
          return
        }
        setMessage('something went wrong, please try again')
      })
      .finally(() => {
        setSignupLoading(false)
      })
  }

  useEffect(() => {
    if (bearerToken) {
      navigate('/dashboard')
    }
  }, [bearerToken, navigate])

  const emailInput = (isDisabled: boolean = false) => (
    <Form.Group controlId="email" className="input-wrapper">
      <Form.Label htmlFor="email">Enter your WUSTL email</Form.Label>
      <Form.Control
        type="email"
        value={user.email}
        pattern=".+@wustl\.edu"
        onChange={(e) =>
          setUser((prev) => ({ ...prev, email: e.target.value }))
        }
        required
        disabled={isDisabled}
      />
    </Form.Group>
  )

  const passwordInput = (
    <Form.Group controlId="password" className="input-wrapper">
      <Form.Label htmlFor="password">Password</Form.Label>
      <Form.Control
        type="password"
        minLength={8}
        value={user.password}
        required
        onChange={(e) =>
          setUser((prev) => ({ ...prev, password: e.target.value }))
        }
      />
    </Form.Group>
  )

  const nameInput = (
    <>
      <Form.Group controlId="first-name" className="input-wrapper">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={user.firstName}
          required
          onChange={(e) =>
            setUser((prev) => ({ ...prev, firstName: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group className="input-wrapper">
        <Form.Label htmlFor="last-name">Last Name</Form.Label>
        <Form.Control
          type="text"
          value={user.lastName}
          required
          onChange={(e) =>
            setUser((prev) => ({ ...prev, lastName: e.target.value }))
          }
        />
      </Form.Group>
    </>
  )

  let form

  if (!emailEntered) {
    form = (
      <Container>
        <h2>Login or Create your Account</h2>
        <Form onSubmit={handleEmailEntered}>
          {emailInput()}
          <div className="action-btns">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </Container>
    )
  } else if (checkUserLoading) {
    form = (
      <Container>
        <h2>Login or Create your Account</h2>
        <Form>
          {emailInput(true)}
          <div className="action-btns">
            <Button type="submit" disabled>
              <ClipLoader size={'0.8rem'} color={'#ffffff'} />
            </Button>
          </div>
        </Form>
      </Container>
    )
  } else if (!userExisted) {
    form = (
      <Container>
        <h2>Create your Account</h2>
        <Form onSubmit={handleRegister}>
          {emailInput(true)}
          {passwordInput}
          {nameInput}
          <div className="action-btns">
            <Button type="button" onClick={handleBack} disabled={signupLoading}>
              Back
            </Button>
            {signupLoading ? (
              <Button type="submit" disabled>
                <ClipLoader size={'0.8rem'} color={'#ffffff'} />
              </Button>
            ) : (
              <Button type="submit">Sign Up</Button>
            )}
          </div>
        </Form>
      </Container>
    )
  } else {
    form = (
      <Container>
        <h2>Welcome back!</h2>
        <Form onSubmit={handleLogin}>
          {emailInput(true)}
          {passwordInput}
          <div className="input-wrapper">
            <div
              className="button-secondary"
              onClick={() => navigate('/forgot_password')}
            >
              Forgot your password?
            </div>
          </div>
          <div className="action-btns">
            <Button type="button" onClick={handleBack} disabled={loginLoading}>
              Back
            </Button>
            <Button type="submit">
              {loginLoading ? (
                <ClipLoader size={'0.8rem'} color={'#ffffff'} />
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </Form>
      </Container>
    )
  }

  return (
    <>
      <HeaderBar />
      <Container className="login-page">
        <Container className="login-body">{form}</Container>
        <div className="login-message">{message}</div>
      </Container>
      <FooterBar />
    </>
  )
}
