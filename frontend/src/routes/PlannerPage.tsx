import { useState } from "react";
import { Term } from "../models/Course";
import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import { PlannerComponent } from "../components/PlannerComponent";
import PlannerAPI from "../services/PlannerAPI";
import './PlannerPage.css'

export default function PlannerPage() {
  const [selected, setSelected] = useState<Term[]>([]);

  const handleBack = () => {
    window.location.href = '/profile';
  }

  const handleSave = () => {
    PlannerAPI.updateSelectedPlan(selected);
    window.location.href = '/dashboard';
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="planner-page">
        <PlannerComponent selected={selected} setSelected={setSelected} />
        <div className="planner-buttons">
          <button onClick={handleBack}>Back to Profile</button>
          <button onClick={handleSave}>Save Schedule</button>
        </div>
      </div>
      <FooterBar />
    </>
  );
}