import { Course } from '../models/Course'
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import './ScheduleBlock.css'
import { useEffect, useState } from 'react';
import StudentAPI from '../services/StudentAPI';
import { ScheduleRow } from './ScheduleRow';

export const ScheduleBlock = () => {
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Course[]>([]);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setRecommended(student.recommended);
      setSelected(student.taken.slice(0, 1));
    });
  }, []);

  const handleDragDrop = (result: DropResult) => {
    const { source, destination } = result;
    console.log(result);

    if (!destination || destination.droppableId !== 'right') {
      return;
    }

    const sourceCourses = source.droppableId === 'left' ? recommended : selected;
    const destinationCourses = destination.droppableId === 'right' ? selected : recommended;

    const [movedCourse] = sourceCourses.splice(source.index, 1);
    destinationCourses.splice(destination.index, 0, movedCourse);

    if (source.droppableId === 'left') {
      setRecommended([...sourceCourses]);
      setSelected([...destinationCourses]);
    }
  };

  return (
    <div className="schedule-block">
      <DragDropContext onDragEnd={handleDragDrop}>
        <div className="recommended-block">
          <Droppable droppableId="left">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                  {recommended.map((course, index) => (
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
        </div>
        <div className="selected-block">
          <Droppable droppableId="right">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                  {selected.map((course, index) => (
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
        </div>
      </DragDropContext>
    </div>
  )
}