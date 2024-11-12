import { useState } from 'react'
import { Col, Container, Row, Spinner } from 'react-bootstrap'

import { useAcademicDataContext } from '../context/useContext'

import './css/ScheduleRow.css'

interface ScheduleRowProps {
  courseId: number
  handleRemoveClick?: () => void
}

export const ScheduleRow: React.FC<ScheduleRowProps> = ({
  courseId,
  handleRemoveClick,
}) => {
  const { courses } = useAcademicDataContext()
  const [displayDescription, setDisplayDescription] = useState(false)

  const course = courses.find((c) => c.id === courseId)

  if (!course) {
    return (
      <Container className="schedule-row">
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          variant="light"
        />{' '}
      </Container>
    )
  }

  return (
    <Container className="schedule-row">
      <Row
        className="schedule-row-header"
        onClick={() => setDisplayDescription(!displayDescription)}
      >
        <Col md="auto" className="course-code">
          {course.code.substring(3)}
        </Col>
        <Col className="course-title">{course.title}</Col>
        <Col md="auto" className="course-units">
          {course.units} Units
        </Col>
        <Col md="auto" className="show-button" title="Show More">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={displayDescription ? 'rotated' : ''}
          >
            <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
          </svg>
        </Col>
      </Row>
      <div
        className={`schedule-row-body ${displayDescription ? 'expanded' : ''}`}
      >
        <div className="content">
          <div className="course-description">{course.description}</div>
          <div className="action-btns">
            <button
              className="secondary"
              onClick={() => window.open(`/course/${course.id}`, '_blank')}
            >
              Details
            </button>
            {handleRemoveClick && (
              <button className="secondary" onClick={handleRemoveClick}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
