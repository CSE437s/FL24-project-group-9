import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { useAcademicDataContext, useAuthContext } from '../context/useContext'
import { Student } from '../models/Student'
import StudentAPI from '../services/StudentAPI'

import './css/ProfileEditPage.css'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { programs } = useAcademicDataContext()
  const { bearerToken } = useAuthContext()
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    StudentAPI.getStudent(bearerToken).then((student) => {
      setStudent(student)
    })
  }, [bearerToken])

  const handleSave = () => {
    if (student) {
      StudentAPI.updateStudent(bearerToken, student).then(() => {
        navigate('/profile')
      })
    }
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="profile-edit-page">
        {student ? (
          <section className="academic-summary">
            <h4>
              Academic Summary
              <button className="secondary" onClick={handleSave}>
                Save
              </button>
            </h4>
            <div className="academic-info">
              <p>
                <label>Program:</label>
                <select
                  defaultValue={student.programs[0]}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      programs: [Number(e.target.value)],
                    })
                  }
                >
                  {programs.map((program, index) => (
                    <option key={index} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <label>Graduation:</label>
                <input
                  type="number"
                  min="1900"
                  max="2099"
                  step="1"
                  value={student.grad}
                  onChange={(e) =>
                    setStudent({ ...student, grad: e.target.value })
                  }
                />
              </p>
              <p>
                <label>Career:</label>
                <input
                  type="text"
                  value={student.career}
                  onChange={(e) =>
                    setStudent({ ...student, career: e.target.value })
                  }
                />
              </p>
            </div>
          </section>
        ) : (
          <h4>No info available, please try again later.</h4>
        )}
      </div>
      <FooterBar />
    </>
  )
}
