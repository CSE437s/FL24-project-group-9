import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Select from 'react-dropdown-select'

import { useAcademicDataContext } from '../context/useContext'
import { Student } from '../models/Student'

import './css/StudentForm.css'

interface StudentFormProps {
  student: Student
  handleSave: (student: Student) => void
  handleCancel?: () => void
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  handleSave,
  handleCancel,
}) => {
  const { academicLoading, programs } = useAcademicDataContext()
  const [newStudent, setNewStudent] = useState<Student>({
    ...student,
    grad: student.grad ?? new Date().getFullYear(),
    programs: [student.programs[0] ?? programs[0].id],
  })
  const [warning, setWarning] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave(newStudent)
  }

  return (
    <Form onSubmit={handleSubmit} className="student-form">
      <Form.Group controlId="program" className="input-wrapper">
        <Form.Label>Program</Form.Label>
        {academicLoading || programs.length === 0 ? (
          <Select
            options={[]}
            values={[]}
            // eslint-disable-next-line prettier/prettier
            onChange={() => { }}
            disabled
            loading
          />
        ) : (
          <Select
            options={programs}
            labelField="name"
            searchBy="name"
            valueField="id"
            values={programs.filter((program) =>
              newStudent.programs.includes(program.id)
            )}
            onChange={(values) =>
              setNewStudent({
                ...newStudent,
                programs: [values[0].id],
              })
            }
            backspaceDelete={false}
            color="#555"
          />
        )}
      </Form.Group>
      <Form.Group controlId="grad" className="input-wrapper">
        <Form.Label>Graduation Year</Form.Label>
        <Form.Control
          type="number"
          min={new Date().getFullYear()}
          max="2040"
          step="1"
          value={newStudent.grad}
          onChange={(e) => {
            setNewStudent({ ...newStudent, grad: e.target.value })
            if (student.grad && e.target.value != student.grad) {
              setWarning(
                'Changing graduation may remove previously added courses'
              )
            } else {
              setWarning('')
            }
          }}
          required
        />
        {warning && <span className="warning">{warning}</span>}
      </Form.Group>
      <Form.Group controlId="career" className="input-wrapper">
        <Form.Label>Career:</Form.Label>
        <Form.Control
          type="text"
          id="career"
          name="career"
          required
          value={newStudent.career}
          onChange={(e) =>
            setNewStudent({ ...newStudent, career: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group controlId="interests" className="input-wrapper">
        <Form.Label>Interests</Form.Label>
        <Form.Control
          type="text"
          name="interests"
          value={newStudent.interests}
          onChange={(e) => {
            setNewStudent({ ...newStudent, interests: e.target.value })
          }}
        />
      </Form.Group>
      <div className="action-btns">
        {handleCancel && (
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save</Button>
      </div>
    </Form>
  )
}
