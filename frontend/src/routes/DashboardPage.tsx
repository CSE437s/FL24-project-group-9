import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleBlock } from '../components/ScheduleBlock'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAcademicDataContext } from '../context/useContext'

import './css/DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { academicLoading, semesters } = useAcademicDataContext()

  const handleEdit = () => {
    navigate('/dashboard/edit')
  }

  const handleGenerate = () => {
    navigate('/planner/')
  }

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading your schedule...']} />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="dashboard-page">
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
      </div>
      <FooterBar />
    </>
  )
}
