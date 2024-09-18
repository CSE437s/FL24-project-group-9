import { HeaderBar } from "../components/HeaderBar";
import './HomePage.css';

export default function HomePage() {
  return (
    <>
      <HeaderBar />
      <div className="home-page">
        <header>
          <h1>Welcome to CoursePlanner</h1>
          <p>CoursePlanner is a tool to help you plan your college courses.</p>
        </header>
        <section className="home-body">
          {/* TODO: redirect to login */}
          <button onClick={() => window.location.href = '/profile'}>Get Started</button>
        </section>
      </div>
      <footer>
        <p>&copy; WashU 2024</p>
      </footer>
    </>
  )
}