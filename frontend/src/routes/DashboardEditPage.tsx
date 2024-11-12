import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { PlannerComponent } from '../components/PlannerComponent'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useStudentContext } from '../context/useContext'

import './css/DashboardEditPage.css'

export default function DashboardEditPage() {
  const navigate = useNavigate()
  const { studentLoading, semesters } = useStudentContext()

  const handleSave = () => {
    navigate('/dashboard')
  }

  if (studentLoading) {
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
        <div className="dashboard-edit-page">
          <section className="no-courses">
            <h4>Unable to get course history at this time</h4>
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
      <Container className="dashboard-edit-page">
        <div className="dashboard-edit-header">
          <Row>
            <Col md={5}>
              <Row>
                <Col>
                  <h4>Course History</h4>
                </Col>
                <Col md="auto">
                  <button className="secondary" onClick={handleSave}>
                    Save
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <p>Add or remove courses from your previous schedule</p>
          </Row>
        </div>
        <PlannerComponent isCompleted={true} />
      </Container>
      <FooterBar />
    </>
  )
}
