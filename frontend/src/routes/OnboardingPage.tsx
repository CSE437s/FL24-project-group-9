import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { StudentForm } from '../components/StudentForm'
import { useStudentContext } from '../context/useContext'
import { Student } from '../models/Student'

import './css/OnboardingPage.css'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { studentLoading, student, updateStudent } = useStudentContext()

  const handleSave = (student: Student) => {
    updateStudent(student).then(() => {
      navigate('/dashboard/edit')
    })
  }

  if (studentLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} isDashboardHidden={true} />
        <SpinnerComponent messages={['Loading student info...']} />
      </>
    )
  }

  if (!student) {
    return (
      <>
        <HeaderBar isNavVisible={true} isDashboardHidden={true} />
        <div className="onboarding-page">
          <h4>No info available, please try again later.</h4>
        </div>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} isDashboardHidden={true} />
      <Container className="onboarding-page">
        <Container className="onboarding-summary">
          <h3>
            Welcome {student.first_name} {student.last_name}!
          </h3>
          <p>Please take a moment to enter the following information:</p>
        </Container>
        <Container className="onboarding-info">
          <StudentForm student={student} handleSave={handleSave} />
        </Container>
      </Container>
      <FooterBar />
    </>
  )
}
