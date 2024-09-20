import { useEffect, useState } from "react";
import { Student } from "../models/Student";
import { Term } from "../models/Course";
import StudentAPI from "../services/StudentAPI";
import PlannerAPI from "../services/PlannerAPI";
import { HeaderBar } from "../components/HeaderBar";
import { FooterBar } from "../components/FooterBar";
import { ScheduleRow } from "../components/ScheduleRow";
import './ProfileEditPage.css';

const MAJORS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biomedical Engineering',
  'Business Administration',
  'Economics',
  'Psychology',
  'Biology',
  'Mathematics',
];

const INTERESTS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Cloud Computing',
  'Internet of Things',
  'Blockchain',
  'Game Development'
];

export default function ProfileEditPage() {
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

  const handleSave = () => {
  }

  const handleInterestChange = (interest: string) => {
    setStudent((prevState) => {
      const interests = prevState.interests.includes(interest)
        ? prevState.interests.filter((i) => i !== interest)
        : [...prevState.interests, interest];
      return { ...prevState, interests };
    });
  };

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="profile-edit-page">
        <section className="academic-summary">
          <h4>Academic Summary<button onClick={handleSave}>Save</button></h4>
          <div className="academic-history">
            {taken.map((term) => (
              <div key={term.id}>
                <h5>{term.term}</h5>
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
                <p>
                  <label>Major:</label>
                  <select
                    value={student.major}
                    onChange={e => setStudent({...student, major: e.target.value})}
                  >
                    {MAJORS.map((major, index) => (
                      major === student.major ?
                        <option key={index} value={major} selected>{major}</option> : 
                        <option key={index} value={major}>{major}</option>
                    ))}
                  </select>
                </p>
                <p>
                  <label>Minor:</label>
                  <select
                    value={student.minor}
                    onChange={e => setStudent({...student, minor: e.target.value})}
                  >
                    {/* TODO: change to minors */}
                    {MAJORS.map((minor, index) => ( 
                      minor === student.minor ?
                        <option key={index} value={minor} selected>{minor}</option> : 
                        <option key={index} value={minor}>{minor}</option>
                    ))}
                  </select>
                </p>
                <p>
                  <label>Graduation:</label>
                  <input type="month"
                    value={student.year}
                    onChange={e => setStudent({...student, year: e.target.value})}
                  />
                </p>
                <p>
                  <label>Career:</label>
                  <input type="text"
                    value={student.career}
                    onChange={e => setStudent({...student, career: e.target.value})}
                  />
                </p>
                <p className="interests">
                  <label>Interests:</label>
                  <div className="interests-input">
                    {INTERESTS.map((interest, index) => (
                      <div>
                        <input
                          type="checkbox" id={`interest-${index}`}
                          checked={student.interests?.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                        />
                        <label key={index} htmlFor={`interest-${index}`}>{interest}</label>
                      </div>
                    ))}
                  </div>
                </p>
              </>
            ) : <></>}
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}