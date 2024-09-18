import { useEffect, useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { Term } from "../models/Course";
import StudentAPI from "../services/StudentAPI";
import { ScheduleRow } from "../components/ScheduleRow";
import './DashboardPage.css';

export default function DashboardPage() {
  const [taken, setTaken] = useState<Term[]>([]);
  const [recommended, setRecommended] = useState<Term[]>([]);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setTaken(student.taken);
      setRecommended(student.recommended);
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
    </>
  )
}