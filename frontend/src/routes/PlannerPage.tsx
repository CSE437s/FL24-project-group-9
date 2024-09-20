import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import { PlannerComponent } from "../components/PlannerComponent";
import './PlannerPage.css'

export default function PlannerPage() {
  const handleBack = () => {
    window.location.href = '/profile';
  }

  const handleSave = () => {
    window.location.href = '/dashboard';
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="planner-page">
        <PlannerComponent />
        <div className="planner-buttons">
          <button onClick={handleBack}>Back to Profile</button>
          <button onClick={handleSave}>Save Schedule</button>
        </div>
      </div>
      <FooterBar />
    </>
  );
}