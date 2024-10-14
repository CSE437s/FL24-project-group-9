// ResetPasswordPage.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

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
      <div className="login-page">
        <section className="login-body">
          <div>
            <h2>Enter your New Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  minLength={8}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="action-btns">
                {resetLoading ? (
                  <button type="button" disabled>
                    <ClipLoader size={'0.8rem'} color={'#ffffff'} />
                  </button>
                ) : (
                  <button type="submit">Reset</button>
                )}
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
