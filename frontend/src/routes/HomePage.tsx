import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import { useAuthContext } from "../context/AuthContext";
import './css/HomePage.css';

export default function HomePage() {
  const { isLoggedIn } = useAuthContext();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      window.location.href = '/profile';
      return;
    }
    window.location.href = '/login';
  }

  return (
    <>
      <HeaderBar />
      <div className="home-page">
        <header>
          <h1>Welcome to CoursePlanner</h1>
          <p>CoursePlanner is a tool to help you plan your college courses.</p>
        </header>
        <section className="home-body">
          <button onClick={handleGetStarted}>Get Started</button>
        </section>
      </div>
      <FooterBar />
    </>
  )
}