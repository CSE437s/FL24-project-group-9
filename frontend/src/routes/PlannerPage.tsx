import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { PlannerComponent } from '../components/PlannerComponent'
import { Semester } from '../models/Semester'

import './css/PlannerPage.css'

export default function PlannerPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Semester[]>([])

  const handleBack = () => {
    navigate('/profile')
  }

  const handleSave = () => {
    navigate('/dashboard')
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="planner-page">
        <PlannerComponent selected={selected} setSelected={setSelected} />
        <div className="planner-buttons">
          <button onClick={handleBack}>Back to Profile</button>
          <button onClick={handleSave}>Save Schedule</button>
        </div>
      </div>
      <FooterBar />
    </>
  )
}
