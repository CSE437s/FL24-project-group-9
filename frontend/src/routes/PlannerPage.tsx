import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { PlannerComponent } from '../components/PlannerComponent'
import { SpinnerComponent } from '../components/SpinnerComponent'
import {
  useAcademicDataContext,
  useStudentContext,
} from '../context/useContext'

import './css/PlannerPage.css'

export default function PlannerPage() {
  const navigate = useNavigate()
  const { academicLoading } = useAcademicDataContext()
  const { semesters } = useStudentContext()

  const handleSave = () => {
    navigate('/dashboard')
  }

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Generating recommended schedule...']} />
      </>
    )
  }

  if (semesters.length === 0) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <div className="planner-page">
          <section className="no-courses">
            <h4>Unable to generate recommended schedule at this time</h4>
            <p>Please try again later</p>
          </section>
        </div>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="planner-page">
        <section className="planner-header">
          <h4>
            Recommended Schedule
            <button className="secondary" onClick={handleSave}>
              Save
            </button>
          </h4>
          <p>Add or Remove Coures from your Upcoming Schedule</p>
        </section>
        <PlannerComponent />
      </div>
      <FooterBar />
    </>
  )
}
