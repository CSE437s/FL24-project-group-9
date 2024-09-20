import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import { ScheduleBlock } from "../components/SchedulerComponent";
import './SchedulerPage.css'

export default function SchedulerPage() {
  const handleBack = () => {
    window.location.href = '/profile';
  }

  const handleSave = () => {
    window.location.href = '/dashboard';
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="scheduler-page">
        <ScheduleBlock />
        <div className="scheduler-buttons">
          <button onClick={handleBack}>Back to Profile</button>
          <button onClick={handleSave}>Save Schedule</button>
        </div>
      </div>
      <FooterBar />
    </>
  );
}