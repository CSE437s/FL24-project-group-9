import { useEffect, useState } from "react";
import { Student } from "../models/Student";
import { Course, Term } from "../models/Course";
import StudentAPI from "../services/StudentAPI";
import PlannerAPI from "../services/PlannerAPI";
import { useAcademicDataContext, useAuthContext } from "../context/useContext";
import { HeaderBar } from "../components/HeaderBar";
import { FooterBar } from "../components/FooterBar";
import { ScheduleRow } from "../components/ScheduleRow";
import { utils } from "../utils";
import './css/ProfileEditPage.css';

export default function ProfileEditPage() {
  const { courses, majors, minors, semesters } = useAcademicDataContext()
  const { bearerToken } = useAuthContext();
  const [student, setStudent] = useState<Student | null>(null);
  const [taken, setTaken] = useState<Term[]>([]);
  const [newCourse, setNewCourse] = useState(courses[0]?.id);
  const [newSemester, setNewSemester] = useState(semesters[0]);

  useEffect(() => {
    StudentAPI.getStudent(bearerToken).then((student) => {
      setStudent(student);
    });
  
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken);
    });
  }, [bearerToken]);

  const handleRemoveClick = (term: Term, course: Course) => {
    term.courses = term.courses.filter((c) => c.id !== course.id);
    setTaken([...taken]);

    if (term.courses.length === 0) {
      setTaken(taken.filter((t) => t.id !== term.id));
    }
  }

  const handleSave = () => {
    if (student) {
      StudentAPI.updateStudent(bearerToken, student);
    }

    PlannerAPI.updateTakenPlan(taken);
  }

  const addCourse = () => {
    const term = taken.find((term) => term.term === newSemester);
    const course = courses.find((course) => course.id === newCourse);

    if(!course) {
      return
    }

    if (term) {
      if (term.courses.find((c) => c.id === course.id)) {
        return;
      }
      term.courses.push(course);
      setTaken([...taken]);
    }
    else {
      const newTerm = {
        id: (Math.max(...taken.map((term) => parseInt(term.id))) + 1).toString(),
        term: newSemester,
        courses: [course]
      }
      setTaken(utils.sortTermObjects([...taken, newTerm]));
    }
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="profile-edit-page">
        <section className="academic-summary">
          <h4>Academic Summary<button onClick={handleSave}>Save</button></h4>
          <div className="academic-history">
            <div className="history-input">
              <p>
                <label>Course:</label>
                <select
                  defaultValue={newCourse}
                  onChange={e => setNewCourse(e.target.value)}
                >
                  {courses.map((course, index) => (
                    <option key={index} value={course.id}>{course.department} {course.code} - {course.title}</option>
                  ))}
                </select>
              </p>
              <p>
                <label>Semester:</label>
                <select
                  value={newSemester}
                  onChange={e => setNewSemester(e.target.value)}
                >
                  {semesters.map((semester, index) => (
                    <option key={index} value={semester}>{semester}</option>
                  ))}
                </select>
              </p>
            </div>
            <button type="button" onClick={addCourse}>Add Course</button>
            {taken.map((term) => (
              <div key={term.id}>
                <div className="term-header">
                  <span className="term-info">{term.term}</span>
                </div>
                {term.courses.map((course) => (
                  <ScheduleRow key={`${term.id} ${course.id}`}
                    course={course}
                    handleRemoveClick={() => handleRemoveClick(term, course)}/>
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
                    defaultValue={student.major}
                    onChange={e => setStudent({...student, major: e.target.value})}
                  >
                    { majors.map((major, index) => <option key={index} value={major}>{major}</option>) }
                  </select>
                </p>
                <p>
                  <label>Minor:</label>
                  <select
                    defaultValue={student.minor}
                    onChange={e => setStudent({...student, minor: e.target.value})}
                  >
                    { minors.map((minor, index) => <option key={index} value={minor}>{minor}</option>) }
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
              </>
            ) : <></>}
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}