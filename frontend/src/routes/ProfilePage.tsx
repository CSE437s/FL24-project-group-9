import { useEffect, useState } from "react";
import { Student } from "../models/Student";
import { Term } from "../models/Course";
import StudentAPI from "../services/StudentAPI";
import PlannerAPI from "../services/PlannerAPI";
import { HeaderBar } from "../components/HeaderBar";
import { FooterBar } from "../components/FooterBar";
import { ScheduleRow } from "../components/ScheduleRow";
import './ProfilePage.css';

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [taken, setTaken] = useState<Term[]>([]);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setStudent(student);
    });
  
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken);
    });
  }, []);

  const handleEditAcademic = () => {
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="profile-page">
        <section className="profile-summary">
          <h3>Welcome to CoursePlanner</h3>
          {student ? (
            <div className="profile-info">
              <p><span>Name</span>: {student.name}</p>
              <p><span>Email</span>: {student.email}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </section>
        <section className="academic-summary">
          <h4>Academic Summary<button onClick={handleEditAcademic}>Edit</button></h4>
          <div className="academic-history">
            {taken.map((term) => (
              <div key={term.id}>
                <h5>{term.term}</h5>
                {term.courses.map((course) => (
                  <ScheduleRow key={course.id} course={course} />
                ))}
              </div>
            ))}
          </div>
          <div className="academic-info">
            {student ? (
              <>
                <p><span>Major</span>: {student.major}</p>
                <p><span>Minor</span>: {student.minor}</p>
                <p><span>Expected Graduation</span>: {student.year}</p>
                <p><span>Career</span>: {student.career}</p>
                <p><span>Interests</span>: {student.interests?.join(', ')}</p>
              </>
            ) : <></>}
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}