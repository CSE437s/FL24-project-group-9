import { useState } from 'react'
import { ClipLoader } from 'react-spinners'

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
      <div className="schedule-row">
        <ClipLoader size={35} color={'#123abc'} loading={true} />
      </div>
    )
  }

  if (!handleRemoveClick) {
    return (
      <div className="schedule-row">
        <div
          className="schedule-row-header"
          onClick={() => window.open(course.url, '_blank')}
        >
          <div className="course-code">{course.code.substring(3)}</div>
          <div className="course-title">{course.title}</div>
          <div className="course-units">{course.units} Units</div>
        </div>
        <div className="schedule-row-body"></div>
      </div>
    )
  }

  return (
    <div className="schedule-row">
      <div
        className="schedule-row-header"
        onClick={() => setDisplayDescription(!displayDescription)}
      >
        <div className="show-button" title="Show More">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={displayDescription ? 'rotated' : ''}
          >
            <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
          </svg>
        </div>
        <div className="course-code">{course.code.substring(3)}</div>
        <div className="course-title">{course.title}</div>
        <div className="course-units">{course.units} Units</div>
        <div
          className="remove-button"
          onClick={handleRemoveClick}
          title="remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
      </div>
      {displayDescription && (
        <div className="schedule-row-body">
          <div className="course-description">{course.description}</div>
        </div>
      )}
    </div>
  )
}
