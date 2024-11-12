import { useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'

import './css/SpinnerComponent.css'

interface SpinnerProps {
  messages: string[]
  delay?: number
}

export const SpinnerComponent: React.FC<SpinnerProps> = ({
  messages,
  delay = 100,
}) => {
  const [messageIndex, setMessageIndex] = useState(0)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [messages.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay]) // Add intentional delay to spinner to avoid flickering

  return (
    <>
      {showSpinner && (
        <Container className="spinner-container">
          <Spinner
            animation="border"
            role="status"
            className="spinner"
            variant="primary"
          ></Spinner>
          <p>{messages[messageIndex]}</p>
        </Container>
      )}
    </>
  )
}
