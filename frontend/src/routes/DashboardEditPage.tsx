import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { PlannerComponent } from '../components/PlannerComponent'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAcademicDataContext } from '../context/useContext'

import './css/DashboardEditPage.css'

export default function DashboardEditPage() {
  const navigate = useNavigate()
  const { academicLoading, semesters } = useAcademicDataContext()

  const handleSave = () => {
    navigate('/dashboard')
  }

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Getting course history...']} />
      </>
    )
  }

  if (semesters.length === 0) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <section className="no-courses">
          <h4>Unable to get course history at this time</h4>
          <p>Please try again later</p>
        </section>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="dashboard-edit-page">
        <section className="dashboard-edit-header">
          <h4>
            Course History
            <button className="secondary" onClick={handleSave}>
              Save
            </button>
          </h4>
          <p>Add or remove courses from your previous schedule</p>
        </section>
        <PlannerComponent isCompleted={true} />
      </div>
      <FooterBar />
    </>
  )
}
