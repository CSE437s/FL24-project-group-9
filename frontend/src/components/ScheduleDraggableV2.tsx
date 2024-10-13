import { Draggable, Droppable } from 'react-beautiful-dnd'

import { useAcademicDataContext } from '../context/useContext'
import { Semester } from '../models/Semester'
import { utils } from '../utils'

import { ScheduleRow } from './ScheduleRow'

interface ScheduleDraggableProps {
  semester: Semester
  droppableId: string
  handleRemoveClick: (semester: Semester, courseId: number) => void
}

export const ScheduleDraggableV2: React.FC<ScheduleDraggableProps> = ({
  semester,
  droppableId,
  handleRemoveClick,
}) => {
  const { courses } = useAcademicDataContext()

  return (
    <div className="schedule-block">
      <div className="schedule-header">
        <span className="schedule-info">{semester.name}</span>
        <span className="schedule-units">
          Total Units: {utils.getTotalUnits(semester, courses)}
        </span>
      </div>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="schedule-draggable"
          >
            {semester.planned_courses.map((courseId, index) => (
              <Draggable
                key={courseId}
                draggableId={`${semester.id}-${courseId}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ScheduleRow
                      courseId={courseId}
                      handleRemoveClick={() =>
                        handleRemoveClick(semester, courseId)
                      }
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
