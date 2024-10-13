import { Draggable, Droppable } from 'react-beautiful-dnd'

import { Semester } from '../models/Semester'

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
  return (
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
              draggableId={courseId.toString()}
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
  )
}
