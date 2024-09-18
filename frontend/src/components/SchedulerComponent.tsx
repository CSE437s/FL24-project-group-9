import { Course } from '../models/Course'
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from 'react';
import StudentAPI from '../services/StudentAPI';
import { ScheduleDraggable } from './ScheduleDraggable';
import './SchedulerComponent.css'

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

    if (!destination || destination.droppableId !== 'selected-1') {
      return;
    }

    const sourceCourses = source.droppableId === 'recommended-1' ? recommended : selected;
    const destinationCourses = destination.droppableId === 'selected-1' ? selected : recommended;

    const [movedCourse] = sourceCourses.splice(source.index, 1);
    destinationCourses.splice(destination.index, 0, movedCourse);

    if (source.droppableId === 'recommended-1') {
      setRecommended([...sourceCourses]);
      setSelected([...destinationCourses]);
    }
  };

  return (
    <div className="schedule-block">
      <DragDropContext onDragEnd={handleDragDrop}>
        <div className="recommended-block">
          <h4>Fall 2024</h4>
          <ScheduleDraggable courses={recommended} droppableId="recommended-1" />
          <h4>Spring 2025</h4>
          <ScheduleDraggable courses={[]} droppableId="recommended-2" />
          <h4>Fall 2025</h4>
          <ScheduleDraggable courses={[]} droppableId="recommended-3" />
          <h4>Spring 2026</h4>
          <ScheduleDraggable courses={[]} droppableId="recommended-4" />
        </div>
        <div className="selected-block">
          <h4>Fall 2024</h4>
          <ScheduleDraggable courses={selected} droppableId="selected-1"/>
          <h4>Spring 2025</h4>
          <ScheduleDraggable courses={[]} droppableId="recommended-2" />
          <h4>Fall 2025</h4>
          <ScheduleDraggable courses={[]} droppableId="recommended-2" />
          <h4>Spring 2026</h4>
          <ScheduleDraggable courses={[]} droppableId="recommended-2" />
        </div>
      </DragDropContext>
    </div>
  )
}