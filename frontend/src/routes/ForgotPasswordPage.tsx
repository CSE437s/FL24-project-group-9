import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

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
      <div className="login-page">
        <section className="login-body">
          <div>
            <h2>Forgot your Password?</h2>
            <p>Send an email to reset your password</p>
            <form onSubmit={handleResetPassword}>
              <div className="input-wrapper">
                <label htmlFor="email">Enter your WUSTL email</label>
                <input
                  type="email"
                  value={email}
                  pattern=".+@wustl\.edu"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="action-btns">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={resetLoading || resetDelay}
                >
                  Back
                </button>
                <button type="submit" disabled={resetLoading || resetDelay}>
                  {resetLoading ? (
                    <ClipLoader size={'0.8rem'} color={'#ffffff'} />
                  ) : (
                    'Reset'
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
        <div className="login-message">{message}</div>
      </div>
      <FooterBar />
    </>
  )
}
