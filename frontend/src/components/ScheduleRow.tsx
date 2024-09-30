import { Course } from '../models/Course'
import './css/ScheduleRow.css'

interface ScheduleRowProps {
  course: Course;
  handleUndoClick?: (course: Course) => void;
  handleRemoveClick?: () => void;
}

export const ScheduleRow: React.FC<ScheduleRowProps> = ({course, handleUndoClick, handleRemoveClick}) => {
  return (
    <div className="schedule-row">
      {handleUndoClick && 
        <div className="undo-button" onClick={() => handleUndoClick(course)} title="undo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </div>
      }
      <div className="course-code">{course.department} {course.code}</div>
      <div className="course-title">{course.title}</div>
      <div className="course-units">{course.credits} Units</div>
      {handleRemoveClick && 
        <div className="remove-button" onClick={handleRemoveClick} title="remove">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </div>
      }
    </div>
  );
}