import { useState } from 'react'

import { useAcademicDataContext } from '../context/useContext'
import { Student } from '../models/Student'

import './css/StudentForm.css'

interface StudentFormProps {
  student: Student
  handleSave: (student: Student) => void
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  handleSave,
}) => {
  const { academicLoading, programs } = useAcademicDataContext()
  const [newStudent, setNewStudent] = useState<Student>(student)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave(newStudent)
  }

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="input-wrapper">
        <label htmlFor="program">Program</label>
        {academicLoading || programs.length === 0 ? (
          <select id="program" name="program" disabled>
            <option>Loading...</option>
          </select>
        ) : (
          <select
            id="program"
            name="program"
            value={newStudent.programs[0]}
            onChange={(e) => {
              setNewStudent({
                ...newStudent,
                programs: [Number(e.target.value)],
              })
            }}
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="input-wrapper">
        <label htmlFor="endYear">Graduation Year</label>
        <input
          type="number"
          min="1900"
          max="2099"
          step="1"
          value={newStudent.grad}
          onChange={(e) =>
            setNewStudent({ ...newStudent, grad: e.target.value })
          }
          required
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="career">Career:</label>
        <input
          type="text"
          id="career"
          name="career"
          required
          value={newStudent.career}
          onChange={(e) =>
            setNewStudent({ ...newStudent, career: e.target.value })
          }
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="interests">Interests</label>
        <input
          type="text"
          id="interests"
          name="interests"
          value={newStudent.interests}
          onChange={(e) => {
            setNewStudent({ ...newStudent, interests: e.target.value })
          }}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  )
}
