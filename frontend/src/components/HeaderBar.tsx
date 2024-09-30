import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import logo from '../assets/logo.svg'
import './css/HeaderBar.css'

interface HeaderBarProps {
  isNavVisible?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({isNavVisible}) => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="logo" onClick={handleLogoClick}/>
      {isNavVisible &&
        <nav>
          <a onClick={() => navigate('/profile')}>Profile</a>
          <a onClick={() => navigate('/planner')}>Planner</a>
          <a onClick={() => navigate('/dashboard')}>Dashboard</a>
          <a onClick={logout}>Logout</a>
        </nav>
      }
    </div>
  )
}