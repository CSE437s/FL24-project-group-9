import { useEffect, useState } from 'react'
import { Button, Container, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import AuthAPI from '../services/AuthAPI'

import './css/LoginPage.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetDelay, setResetDelay] = useState(false)

  useEffect(() => {
    if (resetDelay) {
      setTimeout(() => {
        setResetDelay(false)
      }, 5000)
    }
  }, [resetDelay])

  const handleBack = () => {
    navigate('/login')
  }

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email) return
    setResetLoading(true)
    AuthAPI.resetPassword(email)
      .then((response) => {
        if (response) {
          setMessage(
            'Check your email to reset your password, or click reset again in 5 seconds'
          )
        } else {
          setMessage('User does not exists')
        }
      })
      .finally(() => {
        setResetLoading(false)
        setResetDelay(true)
      })
  }
  return (
    <>
      <HeaderBar />
      <Container className="login-page">
        <Container className="login-body">
          <Container>
            <h2>Forgot your Password?</h2>
            <p>Send an email to reset your password</p>
            <Form onSubmit={handleResetPassword}>
              <Form.Group controlId="email" className="input-wrapper">
                <Form.Label>Enter your WUSTL email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  pattern=".+@wustl\.edu"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="action-btns">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={resetLoading || resetDelay}
                >
                  Back
                </Button>
                <Button type="submit" disabled={resetLoading || resetDelay}>
                  {resetLoading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="light"
                    />
                  ) : (
                    'Reset'
                  )}
                </Button>
              </div>
            </Form>
          </Container>
        </Container>
        <div className="login-message">{message}</div>
      </Container>
      <FooterBar />
    </>
  )
}
