import { useEffect, useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { Term } from "../models/Course";
import PlannerAPI from "../services/PlannerAPI";
import { ScheduleRow } from "../components/ScheduleRow";
import { FooterBar } from "../components/FooterBar";
import './DashboardPage.css';

export default function DashboardPage() {
  const [selected, setSelected] = useState<Term[]>([]);

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setSelected(plan.selected);
    });
  }, []);

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="dashboard-page">
        <h3>Current Schedule</h3>
        {selected.map((term) => (
          <div key={term.id}>
            <h4>{term.term}</h4>
            {term.courses.map((course) => (
              <ScheduleRow key={course.id} course={course} />
            ))}
          </div>
        ))}
      </div>
      <FooterBar />
    </>
  )
}