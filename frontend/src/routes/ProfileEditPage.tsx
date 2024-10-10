import { useEffect, useState } from "react";
import { Student } from "../models/Student";
import StudentAPI from "../services/StudentAPI";
import { useAcademicDataContext, useAuthContext } from "../context/useContext";
import { HeaderBar } from "../components/HeaderBar";
import { FooterBar } from "../components/FooterBar";
import './css/ProfileEditPage.css';

export default function ProfileEditPage() {
  const { majors, minors } = useAcademicDataContext()
  const { bearerToken } = useAuthContext();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    StudentAPI.getStudent(bearerToken).then((student) => {
      setStudent(student);
    });
  }, [bearerToken]);

  const handleSave = () => {
    if (student) {
      StudentAPI.updateStudent(bearerToken, student);
    }
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="profile-edit-page">
        {student ? (
          <section className="academic-summary">
            <h4>Academic Summary<button className="secondary" onClick={handleSave}>Save</button></h4>
            <div className="academic-info">
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
            </div>
          </section>) : <h4>No info available, please try again later.</h4>
        }
      </div>
      <FooterBar />
    </>
  )
}