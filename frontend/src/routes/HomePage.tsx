import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { useAuthContext } from '../context/useContext'

import './css/HomePage.css'

export default function HomePage() {
  const { bearerToken } = useAuthContext()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (bearerToken) {
      navigate('/dashboard')
      return
    }
    navigate('/login')
  }

  return (
    <>
      <HeaderBar />
      <Container className="home-page">
        <Container>
          <h1>Welcome to CoursePlanner</h1>
          <p>CoursePlanner is a tool to help you plan your college courses.</p>
        </Container>
        <Container className="home-body">
          <Button onClick={handleGetStarted}>Get Started</Button>
        </Container>
      </Container>
      <FooterBar />
    </>
  )
}
