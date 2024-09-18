import { Course } from '../models/Course'
import './ScheduleBlock.css'

interface ScheduleRowProps {
  course: Course;
}

export const ScheduleRow: React.FC<ScheduleRowProps> = ({course}) => {
  return (
    <div className="schedule-row">
      <div>{course.department} {course.code}</div>
      <div>{course.title}</div>
      <div>{course.credits}</div>
    </div>
  );
}