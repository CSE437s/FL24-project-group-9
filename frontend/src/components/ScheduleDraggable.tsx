import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Course } from '../models/Course'
import { ScheduleRow } from './ScheduleRow';

interface ScheduleDraggableProps {
  courses: Course[];
  droppableId: string;
}

export const ScheduleDraggable: React.FC<ScheduleDraggableProps> = ({courses, droppableId}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="schedule-draggable">
            {courses.map((course, index) => (
              <Draggable key={course.id} draggableId={course.id.toString()} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <ScheduleRow course={course} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}