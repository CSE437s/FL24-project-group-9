import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../models/Student";
import { Term } from "../models/Course";
import StudentAPI from "../services/StudentAPI";
import PlannerAPI from "../services/PlannerAPI";
import { HeaderBar } from "../components/HeaderBar";
import { FooterBar } from "../components/FooterBar";
import { ScheduleRow } from "../components/ScheduleRow";
import './css/ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate('/profile/edit');
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="profile-page">
        <section className="profile-summary">
          <h3>Welcome to CoursePlanner</h3>
          {student ? (
            <div className="profile-info">
              <p><span>Name:</span> {student.name}</p>
              <p><span>Email:</span> {student.email}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </section>
        <section className="academic-summary">
          <h4>Academic Summary<button onClick={handleEdit}>Edit</button></h4>
          <div className="academic-history">
            {taken.map((term) => (
              <div key={term.id}>
                <div className="term-header">
                  <span className="term-info">{term.term}</span>
                </div>
                {term.courses.map((course) => (
                  <ScheduleRow key={course.id} course={course} />
                ))}
              </div>
            ))}
            {taken.length === 0 ? <h4>No Courses Added</h4> : <></>}
          </div>
          <div className="academic-info">
            {student ? (
              <>
                <p><span>Major:</span> {student.major}</p>
                <p><span>Minor:</span> {student.minor}</p>
                <p><span>Graduation:</span> {student.year}</p>
                <p><span>Career:</span> {student.career}</p>
                <p><span>Interests:</span> {student.interests?.join(', ')}</p>
              </>
            ) : <></>}
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}