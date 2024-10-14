import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthAPI from '../services/AuthAPI'

export default function VerifyEmailPage() {
  const { uid, token } = useParams()
  const [message, setMessage] = useState('Verifying...')

  useEffect(() => {
    const verifyEmail = async () => {
      if (uid && token) {
        AuthAPI.verifyEmail(uid, token)
          .then((response) => {
            if (response) {
              setMessage('Email verified successfully!')
              setTimeout(() => {
                window.location.href = '/login'
              }, 200)
            } else {
              setMessage('Email verification failed.')
            }
          })
          .catch(() => {
            setMessage('An error occurred during verification.')
          })
      } else {
        setMessage('Invalid verification link.')
      }
    }

    verifyEmail()
  }, [uid, token])

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}
