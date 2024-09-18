import logo from '../assets/logo.svg'
import './HeaderBar.css'

export default function HeaderBar() {
  const handleLogoClick = () => {
    window.location.href = '/';
  }

  return (
    <div className="header-bar">
      <img src={logo} alt="Logo" className="logo" onClick={handleLogoClick}/>
      <nav>
        <a href="/profile">Profile</a>
        <a href="/scheduler">Scheduler</a>
        <a href="/dashboard">Dashboard</a>
      </nav>
    </div>
  )
}