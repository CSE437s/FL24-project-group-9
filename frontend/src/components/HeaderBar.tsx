import { Container, Image, Nav, Navbar } from 'react-bootstrap'

import logo from '../assets/logo.svg'
import { useAuthContext } from '../context/useContext'

import './css/HeaderBar.css'

interface HeaderBarProps {
  isNavVisible?: boolean
  isDashboardHidden?: boolean
  isLogoutHidden?: boolean
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isNavVisible,
  isDashboardHidden,
  isLogoutHidden,
}) => {
  const { logout } = useAuthContext()

  return (
    <Navbar expand="lg" className="header-bar">
      <Container>
        <Navbar.Brand href="/">
          <Image src={logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        {isNavVisible && (
          <Nav>
            {!isDashboardHidden && (
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            )}
            {!isLogoutHidden && <Nav.Link onClick={logout}>Logout</Nav.Link>}
          </Nav>
        )}
      </Container>
    </Navbar>
  )
}
