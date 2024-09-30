import { useEffect, useState } from "react";
import { Student } from "../models/Student";
import { Course, Term } from "../models/Course";
import CoursesAPI from "../services/CoursesAPI";
import StudentAPI from "../services/StudentAPI";
import PlannerAPI from "../services/PlannerAPI";
import { HeaderBar } from "../components/HeaderBar";
import { FooterBar } from "../components/FooterBar";
import { ScheduleRow } from "../components/ScheduleRow";
import { utils } from "../utils";
import './css/ProfileEditPage.css';

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

const SEMESTERS = [
  'Fall 2023',
  'Spring 2024',
  'Fall 2024',
  'Spring 2025',
  'Fall 2025',
  'Spring 2026',
  'Fall 2026',
  'Spring 2027',
  'Fall 2027',
  'Spring 2028',
];

export default function ProfileEditPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [taken, setTaken] = useState<Term[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState('');
  const [newSemester, setNewSemester] = useState(SEMESTERS[0]);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setStudent(student);
    });
  
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken);
    });

    CoursesAPI.getAllCourses().then((courses) => {
      setCourses(courses);
      setNewCourse(courses[0].id);
    });
  }, []);

  const handleRemoveClick = (term: Term, course: Course) => {
    term.courses = term.courses.filter((c) => c.id !== course.id);
    setTaken([...taken]);

    if (term.courses.length === 0) {
      setTaken(taken.filter((t) => t.id !== term.id));
    }
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interest = e.target.id.replace('interest-', '');

    if (!student) {
      return;
    }

    if (e.target.checked) {
      setStudent({...student, interests: [...student.interests ?? [], INTERESTS[parseInt(interest)]]});
    }
    else {
      setStudent({...student, interests: student.interests?.filter((item) => item !== INTERESTS[parseInt(interest)])});
    }
  }

  const handleSave = () => {
    if (student) {
      StudentAPI.updateStudent(student);
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
                  {SEMESTERS.map((semester, index) => (
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
                    { MAJORS.map((major, index) => <option key={index} value={major}>{major}</option>) }
                  </select>
                </p>
                <p>
                  <label>Minor:</label>
                  <select
                    defaultValue={student.minor}
                    onChange={e => setStudent({...student, minor: e.target.value})}
                  >
                    {/* TODO: change to minors */}
                    { MAJORS.map((minor, index) => <option key={index} value={minor}>{minor}</option>) }
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
                <div className="interests">
                  <label>Interests:</label>
                  <div className="interests-input">
                    {INTERESTS.map((interest, index) => (
                      <div key={index}>
                        <input
                          type="checkbox" id={`interest-${index}`}
                          checked={student.interests?.includes(interest)}
                          onChange={handleCheckbox}
                        />
                        <label htmlFor={`interest-${index}`}>{interest}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : <></>}
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}