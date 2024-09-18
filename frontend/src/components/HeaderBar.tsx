import logo from '../assets/logo.svg'
import './HeaderBar.css'

interface HeaderBarProps {
  isNavVisible?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({isNavVisible}) => {
  const handleLogoClick = () => {
    window.location.href = '/';
  }

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="logo" onClick={handleLogoClick}/>
      {isNavVisible &&
        <nav>
          <a href="/profile">Profile</a>
          <a href="/scheduler">Scheduler</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      }
    </div>
  )
}