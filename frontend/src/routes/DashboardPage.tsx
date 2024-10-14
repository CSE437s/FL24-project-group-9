import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleBlock } from '../components/ScheduleBlock'
import { SpinnerComponent } from '../components/SpinnerComponent'
import {
  useAcademicDataContext,
  useStudentContext,
} from '../context/useContext'

import './css/DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { programs, academicLoading, semesters } = useAcademicDataContext()
  const { studentLoading, student } = useStudentContext()

  const handleEdit = () => {
    navigate('/dashboard/edit')
  }

  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  const handleGenerate = () => {
    navigate('/planner/')
  }

  if (studentLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading your schedule...']} />
      </>
    )
  }

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading your schedule...']} />
      </>
    )
  }

  const profileComponent = student ? (
    <>
      <h2>
        Welcome to CoursePlanner {student?.first_name} {student?.last_name}!
      </h2>
      <section className="academic-summary">
        <h4>
          Academic Summary
          <button className="secondary" onClick={handleEditProfile}>
            Edit
          </button>
        </h4>
        <div className="academic-info">
          <p>
            <span>Programs:</span>{' '}
            {programs.filter((p) => p.id == student.programs[0])[0]?.name}
          </p>
          <p>
            <span>Graduation:</span> {student.grad}
          </p>
          <p>
            <span>Career:</span> {student.career}
          </p>
        </div>
      </section>
    </>
  ) : (
    <section className="profile-summary">
      <h4>No info available, please try again later.</h4>
    </section>
  )

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="dashboard-page">
        {profileComponent}
        <section className="dashboard-summary">
          <h3>Your Schedule</h3>
          <div className="schedule">
            {semesters.filter((s) => s.isCompleted).length ? (
              <div className="history">
                <h4>
                  History
                  <button className="secondary" onClick={handleEdit}>
                    Edit History
                  </button>
                </h4>
                {semesters
                  .filter((s) => s.isCompleted)
                  .map((semester) => (
                    <ScheduleBlock key={semester.id} semester={semester} />
                  ))}
              </div>
            ) : (
              <></>
            )}
            <div className="planned">
              <h4>
                <span>Upcoming Courses</span>
                <button className="secondary" onClick={handleGenerate}>
                  Generate new Schedule
                </button>
              </h4>
              {semesters
                .filter((s) => !s.isCompleted)
                .map((semester) => (
                  <ScheduleBlock key={semester.id} semester={semester} />
                ))}
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}
