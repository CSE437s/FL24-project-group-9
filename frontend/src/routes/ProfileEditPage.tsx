import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { StudentForm } from '../components/StudentForm'
import { useStudentContext } from '../context/useContext'
import { Student } from '../models/Student'

import './css/ProfileEditPage.css'

export default function ProfileEditPage() {
  const navigate = useNavigate()
  const { studentLoading, student, updateStudent } = useStudentContext()

  const handleSave = (student: Student) => {
    updateStudent(student).then(() => {
      navigate('/dashboard')
    })
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  if (studentLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading student info...']} />
      </>
    )
  }

  if (!student) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <div className="profile-edit-page">
          <h4>No info available, please try again later.</h4>
        </div>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <Container className="profile-edit-page">
        <Container className="profile-summary">
          <h4>Edit your Profile</h4>
        </Container>
        <Container className="profile-info">
          <StudentForm
            student={student}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        </Container>
      </Container>
      <FooterBar />
    </>
  )
}
