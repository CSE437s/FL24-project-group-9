import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleRow } from '../components/ScheduleRow'
import { TermHeader } from '../components/TermHeader'
import { useAcademicDataContext } from '../context/useContext'

import './css/DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { semesters } = useAcademicDataContext()

  const handleEdit = () => {
    navigate('/dashboard/edit')
  }

  const handleGenerate = () => {
    navigate('/planner/')
  }

  // if (loading) {
  //   return (
  //     <>
  //       <HeaderBar isNavVisible={true} />
  //       <SpinnerComponent messages={['Loading your schedule...']} />
  //       <FooterBar />
  //     </>
  //   )
  // }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="dashboard-page">
        <h3>Your Schedule</h3>
        <div className="schedule">
          <div className="history">
            <h4>
              History{' '}
              <button className="secondary" onClick={handleEdit}>
                Edit History
              </button>
            </h4>
            {semesters
              .filter((semester) => semester.isCompleted)
              .map((semester) => (
                <div key={semester.id}>
                  <TermHeader semester={semester} />
                  {semester.planned_courses.map((course) => (
                    <ScheduleRow key={course.id} course={course} />
                  ))}
                </div>
              ))}
          </div>
          <div className="planned">
            <h4>
              <span>Upcoming Courses</span>
              <button className="secondary" onClick={handleGenerate}>
                Generate new Schedule
              </button>
            </h4>
            {semesters
              .filter((semester) => !semester.isCompleted)
              .map((semester) => (
                <div key={semester.id}>
                  <TermHeader semester={semester} />
                  {semester.planned_courses.map((course) => (
                    <ScheduleRow key={course.id} course={course} />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  )
}
