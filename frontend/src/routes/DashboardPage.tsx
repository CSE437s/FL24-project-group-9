import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleRow } from '../components/ScheduleRow'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { TermHeader } from '../components/TermHeader'
import { Term } from '../models/Course'
import PlannerAPI from '../services/PlannerAPI'

import './css/DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [taken, setTaken] = useState<Term[]>([])
  const [selected, setSelected] = useState<Term[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken)
      setSelected(plan.selected)
      setLoading(false)
    })
  }, [])

  const handleEdit = () => {
    navigate('/dashboard/edit')
  }

  const handleGenerate = () => {
    navigate('/planner/')
  }

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading your schedule...']} />
        <FooterBar />
      </>
    )
  }

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
            {taken.map((term) => (
              <div key={term.id}>
                <TermHeader term={term} />
                {term.courses.map((course) => (
                  <ScheduleRow key={course.id} course={course} />
                ))}
              </div>
            ))}
            {taken.length === 0 ? <h4>No Courses Added</h4> : <></>}
          </div>
          <div className="planned">
            <h4>
              <span>Upcoming Courses</span>
              <button className="secondary" onClick={handleGenerate}>
                Generate new Schedule
              </button>
            </h4>
            {selected.map((term) => (
              <div key={term.id}>
                <TermHeader term={term} />
                {term.courses.map((course) => (
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
