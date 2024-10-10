import { Draggable, Droppable } from 'react-beautiful-dnd'

import { Course } from '../models/Course'

import { ScheduleRow } from './ScheduleRow'

interface ScheduleDraggableProps {
  courses: Course[];
  droppableId: string;
  handleUndo: (courseId: string, termId: string) => void;
}

export const ScheduleDraggable: React.FC<ScheduleDraggableProps> = ({courses, droppableId, handleUndo}) => {
  const canUndo = droppableId.indexOf('selected') !== -1
  
  const handleUndoClick = (course: Course) => {
    if (!canUndo) {
      return
    }

    const selectedTermId = droppableId.split('-')[1]
    handleUndo(course.id, selectedTermId)
  }

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="schedule-draggable">
            {courses.map((course, index) => (
              <Draggable key={course.id} draggableId={course.id.toString()} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {canUndo ?
                      <ScheduleRow course={course} handleUndoClick={handleUndoClick}/> : 
                      <ScheduleRow course={course} />
      }
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