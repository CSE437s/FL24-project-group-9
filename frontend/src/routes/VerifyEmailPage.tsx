import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthAPI from '../services/AuthAPI'

export default function VerifyEmailPage() {
  const { uid, token } = useParams()
  const [status, setStatus] = useState('Verifying...')

  useEffect(() => {
    const verifyEmail = async () => {
      if (uid && token) {
        AuthAPI.verifyEmail(uid, token)
          .then((response) => {
            if (response) {
              setStatus('Email verified successfully!')
              setTimeout(() => {
                window.location.href = '/login'
              }, 200)
            } else {
              setStatus('Email verification failed.')
            }
          })
          .catch(() => {
            setStatus('An error occurred during verification.')
          })
      } else {
        setStatus('Invalid verification link.')
      }
    }

    verifyEmail()
  }, [uid, token])

  return (
    <div>
      <h1>{status}</h1>
    </div>
  )
}
