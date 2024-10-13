import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { PlannerComponent } from '../components/PlannerComponent'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAcademicDataContext } from '../context/useContext'

import './css/PlannerPageV2.css'

export default function PlannerPageV2() {
  const navigate = useNavigate()
  const { semesters, academicLoading } = useAcademicDataContext()

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
        <section className="no-courses">
          <h4>Unable to generate recommended schedule at this time</h4>
          <p>Please try again later</p>
        </section>
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
