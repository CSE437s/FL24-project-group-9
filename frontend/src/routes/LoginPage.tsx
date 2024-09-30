import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import './css/LoginPage.css'

export default function LoginPage() {
  const { isLoggedIn, login, signup } = useAuthContext()
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [emailEntered, setEmailEntered] = useState(false)
  const [userExisted, setUserExisted] = useState(false)
  const [message, setMessage] = useState('')

  const checkUser = () => {
    // TODO: call from API
    setUserExisted(true)
  }

  const handleEmailEntered = (event: React.FormEvent) => {
    event.preventDefault()
    setEmailEntered(true)
    checkUser()
  }

  const handleBack = () => {
    setMessage('')
    setEmailEntered(false)
    setUserExisted(false)
  }

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('wrong password, please try again')
    login()
  }

  const handleSignUp = (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    signup()
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <HeaderBar />
      <div className="login-page">
        <section className="login-body">
          {!emailEntered && 
          <div>
            <h2>Login or Create your Account</h2>
            <form onSubmit={handleEmailEntered}>
              <div className="input-wrapper">
                <label htmlFor="email">Enter your WUSTL email</label>
                <input type="email" value={email} pattern=".+@wustl\.edu"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Continue</button>
            </form>
          </div>}
          {emailEntered && !userExisted &&
          <div>
            <h2>Create your Account</h2>
            <form onSubmit={handleSignUp}>
              <div className="input-wrapper">
                <label htmlFor="email">Email</label>
                <input type="email" value ={email} disabled />
              </div>
              <div className="input-wrapper">
                <label htmlFor="password">Create a Password</label>
                <input type="password" minLength={8} required />
              </div>
              <div className="input-wrapper">
                <label htmlFor="first-name">First Name</label>
                <input type="text" required />
              </div>
              <div className="input-wrapper">
                <label htmlFor="last-name">Last Name</label>
                <input type="text" required />
              </div>
              <div className="action-btns">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>}
          {emailEntered && userExisted &&
          <div>
            <h2>Welcome back!</h2>
            <form onSubmit={handleLogin}>
              <div className="input-wrapper">
                <label htmlFor="email">Email</label>
                <input type="email" value ={email} disabled />
              </div>
              <div className="input-wrapper">
                <label htmlFor="password">Enter your Password</label>
                <input type="password" required/>
              </div>
              <div className="action-btns">
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Login</button>
              </div>
            </form>
          </div>}
        </section>
        <div className="login-message">{message}</div>
      </div>
      <FooterBar />
    </>
  )
}