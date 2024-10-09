import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Course, Term } from '../models/Course'
import { ScheduleRow } from './ScheduleRow';

interface ScheduleDraggableProps {
  term: Term;
  droppableId: string;
  handleRemoveClick: (term: Term, course: Course) => void;
}

export const ScheduleDraggableV2: React.FC<ScheduleDraggableProps> = ({term, droppableId, handleRemoveClick}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="schedule-draggable">
            {term.courses.map((course, index) => (
              <Draggable key={course.id} draggableId={course.id.toString()} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <ScheduleRow course={course} handleRemoveClick={() => handleRemoveClick(term, course)} />
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