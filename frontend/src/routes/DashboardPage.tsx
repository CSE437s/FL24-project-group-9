import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderBar } from "../components/HeaderBar";
import { Term } from "../models/Course";
import PlannerAPI from "../services/PlannerAPI";
import { ScheduleRow } from "../components/ScheduleRow";
import { FooterBar } from "../components/FooterBar";
import './css/DashboardPage.css';
import { TermHeader } from "../components/TermHeader";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [taken, setTaken] = useState<Term[]>([]);
  const [selected, setSelected] = useState<Term[]>([]);

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken);
      setSelected(plan.selected);
    });
  }, []);

  const handleEdit = () => {
    navigate('/profile/edit');
  }

  const handleGenerate = () => {
    navigate('/planner/');
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="dashboard-page">
        <h3>Your Schedule</h3>
        <div className="schedule">
          <div className="history">
            <h4>History <button className="secondary" onClick={handleEdit}>Edit History</button></h4>
            {taken.map((term) => (
              <div key={term.id}>
                <TermHeader term={term} />
                {term.courses.map((course) => (
                  <ScheduleRow key={course.id} course={course} />
                ))}
              </div>
            ))}
          </div>
          <div className="planned">
            <h4><span>Upcoming Courses</span><button className="secondary" onClick={handleGenerate}>Generate new Schedule</button></h4>
            {selected.map((term) => (
              <div key={term.id}>
                <TermHeader term={term} />
                {term.courses.map((course) => (
                  <ScheduleRow key={course.id} course={course} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  )
}