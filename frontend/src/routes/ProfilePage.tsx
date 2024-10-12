import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAuthContext } from '../context/useContext'
import { Student } from '../models/Student'
import StudentAPI from '../services/StudentAPI'

import './css/ProfilePage.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { bearerToken } = useAuthContext()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      StudentAPI.getStudent(bearerToken)
        .then((student) => {
          setStudent(student)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
        })
    }, 100) // TODO: remove this intentional delay
  }, [bearerToken])

  const handleEdit = () => {
    navigate('/profile/edit')
  }

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading student info...']} />
        <FooterBar />
      </>
    )
  }

  if (!student) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <div className="profile-page">
          <h4>No info available, please try again later.</h4>
        </div>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="profile-page">
        <section className="profile-summary">
          <h3>Welcome to CoursePlanner</h3>
          <div className="profile-info">
            <p>
              <span>Name:</span> {student.first_name} {student.last_name}
            </p>
            <p>
              <span>Email:</span> {student.email}
            </p>
          </div>
        </section>
        <section className="academic-summary">
          <h4>
            Academic Summary
            <button className="secondary" onClick={handleEdit}>
              Edit
            </button>
          </h4>
          <div className="academic-info">
            <p>
              <span>Programs:</span> {student.programs[0].name}
            </p>
            <p>
              <span>Graduation:</span> {student.grad}
            </p>
            <p>
              <span>Career:</span> {student.career}
            </p>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}
