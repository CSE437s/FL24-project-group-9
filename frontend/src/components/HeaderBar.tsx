import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="logo" onClick={handleLogoClick} />
      {isNavVisible && (
        <nav>
          {!isDashboardHidden && (
            <a onClick={() => navigate('/dashboard')}>Dashboard</a>
          )}
          {!isLogoutHidden && <a onClick={logout}>Logout</a>}
        </nav>
      )}
    </div>
  )
}
