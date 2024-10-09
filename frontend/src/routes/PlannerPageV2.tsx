import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Course, Term } from "../models/Course";
import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import { TermHeader } from "../components/TermHeader";
import { ScheduleDraggableV2 } from "../components/ScheduleDraggableV2";
import { useAcademicDataContext } from "../context/useContext";
import PlannerAPI from "../services/PlannerAPI";
import './css/PlannerPageV2.css'

export default function PlannerPageV2() {
  const navigate = useNavigate();
  const { courses, semesters } = useAcademicDataContext()
  const [selected, setSelected] = useState<Term[]>([]);
  const [newCourse, setNewCourse] = useState(courses[0]?.id);
  const [newSemester, setNewSemester] = useState(semesters[0]);

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setSelected(plan.recommended);
    });
  }, []);

  const handleSave = () => {
    PlannerAPI.updateSelectedPlan(selected);
    navigate('/dashboard');
  }

  const handleRemoveClick = (term: Term, course: Course) => {
    term.courses = term.courses.filter((c) => c.id !== course.id);
    setSelected([...selected]);
  }

  const handleDragDrop = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.index === destination.index && source.droppableId === destination.droppableId) {
      return;
    }

    const sourceTermId = source.droppableId.split('-')[1];
    const destinationTermId = destination.droppableId.split('-')[1];

    const sourceTerm = selected.find(term => term.id === sourceTermId);
    const destinationTerm = selected.find(term => term.id === destinationTermId);

    if (!sourceTerm || !destinationTerm) {
      return;
    }

    const [movedCourse] = sourceTerm.courses.splice(source.index, 1);
    destinationTerm.courses.splice(destination.index, 0, movedCourse);

    setSelected([...selected]);
  };

  const addCourse = () => {
    const term = selected.find((term) => term.term === newSemester);
    const course = courses.find((course) => course.id === newCourse);

    if(!course) {
      return
    }

    if (term) {
      if (term.courses.find((c) => c.id === course.id)) {
        return;
      }
      term.courses.push(course);
      setSelected([...selected]);
    }
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="planner-page">
        <div className="add-course">
          <h4>Add Course</h4>
          <p>
            <label>Course:</label>
            <select
              defaultValue={newCourse}
              onChange={e => setNewCourse(e.target.value)}
            >
              {courses.map((course, index) => (
                <option key={index} value={course.id}>{course.department} {course.code} - {course.title}</option>
              ))}
            </select>
          </p>
          <p>
            <label>Semester:</label>
            <select
              value={newSemester}
              onChange={e => setNewSemester(e.target.value)}
            >
              {semesters.map((semester, index) => (
                <option key={index} value={semester}>{semester}</option>
              ))}
            </select>
          </p>
          <div>
            <button type="button" onClick={addCourse}>Add Course</button>
          </div>
        </div>
        <div className="planner-component">
          <h4>Recommened Schedule</h4>
          <DragDropContext onDragEnd={handleDragDrop}>
            <div className="selected-block">
              {selected.map((term) => (
                <div key={term.id} className="schedule-term">
                  <TermHeader term={term} />
                  <ScheduleDraggableV2
                    term={term}
                    droppableId={`selected-${term.id}`}
                    handleRemoveClick={handleRemoveClick}
                  />
                </div>
              ))}
            </div>
          </DragDropContext>
          <div className="planner-buttons">
            <button onClick={handleSave}>Save Schedule</button>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
}