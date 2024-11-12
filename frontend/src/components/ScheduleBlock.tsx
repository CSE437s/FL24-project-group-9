import { Col, Row } from 'react-bootstrap'

import { useAcademicDataContext } from '../context/useContext'
import { Semester } from '../models/Semester'
import { utils } from '../utils'

import { ScheduleRow } from './ScheduleRow'

import './css/ScheduleBlock.css'

interface ScheduleBlockProps {
  draggable?: boolean
  semester: Semester
  handleRemoveClick?: (semester: Semester, courseId: number) => void
}

export const ScheduleBlock: React.FC<ScheduleBlockProps> = ({
  semester,
  handleRemoveClick,
}) => {
  const { courses } = useAcademicDataContext()

  return (
    <>
      <Row className="schedule-header">
        <Col className="schedule-info">{semester.name}</Col>
        <Col md="auto" className="schedule-units">
          Total Units: {utils.getTotalUnits(semester, courses)}
        </Col>
      </Row>
      {semester.planned_courses.map((courseId) =>
        handleRemoveClick ? (
          <ScheduleRow
            key={courseId}
            courseId={courseId}
            handleRemoveClick={() => handleRemoveClick(semester, courseId)}
          />
        ) : (
          <ScheduleRow key={courseId} courseId={courseId} />
        )
      )}
    </>
  )
}
