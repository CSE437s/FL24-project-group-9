import { useState } from 'react'
import { Button, Container, Form, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import AuthAPI from '../services/AuthAPI'

import './css/LoginPage.css'

export default function ResetPasswordPage() {
  const { uid, token } = useParams()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uid || !token) {
      setMessage('Invalid reset link')
      return
    }
    setResetLoading(true)
    AuthAPI.resetPasswordConfirm(uid, token, password)
      .then((response) => {
        if (response) {
          setMessage('Password reset successfully')
          setTimeout(() => {
            window.location.href = '/login'
          }, 200)
        } else {
          setMessage('Invalid reset link')
        }
      })
      .finally(() => {
        setResetLoading(false)
      })
  }

  return (
    <>
      <HeaderBar />
      <Container className="login-page">
        <Container className="login-body">
          <Container>
            <h2>Enter your New Password</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="password" className="input-wrapper">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  minLength={8}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="action-btns">
                {resetLoading ? (
                  <Button type="button" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="light"
                    />{' '}
                  </Button>
                ) : (
                  <Button type="submit">Reset</Button>
                )}
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
