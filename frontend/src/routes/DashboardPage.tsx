import { useEffect, useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { Term } from "../models/Course";
import PlannerAPI from "../services/PlannerAPI";
import { ScheduleRow } from "../components/ScheduleRow";
import { FooterBar } from "../components/FooterBar";
import './DashboardPage.css';

export default function DashboardPage() {
  const [taken, setTaken] = useState<Term[]>([]);
  const [recommended, setRecommended] = useState<Term[]>([]);

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken);
      setRecommended(plan.recommended);
    });
  }, []);

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="dashboard-page">
        <h3>Courses Taken</h3>
        {taken.map((term) => (
          <div key={term.id}>
            <h4>{term.term}</h4>
            {term.courses.map((course) => (
              <ScheduleRow key={course.id} course={course} />
            ))}
          </div>
        ))}
        <h3>Recommended</h3>
        {recommended.map((term) => (
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