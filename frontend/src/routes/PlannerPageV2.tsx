import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Course, Term } from "../models/Course";
import { FooterBar } from "../components/FooterBar";
import { HeaderBar } from "../components/HeaderBar";
import { TermHeader } from "../components/TermHeader";
import { ScheduleDraggableV2 } from "../components/ScheduleDraggableV2";
import { SpinnerComponent } from "../components/SpinnerComponent";
import { useAcademicDataContext } from "../context/useContext";
import PlannerAPI from "../services/PlannerAPI";
import './css/PlannerPageV2.css'

export default function PlannerPageV2() {
  const navigate = useNavigate();
  const { courses, semesters } = useAcademicDataContext()
  const [selected, setSelected] = useState<Term[]>([]);
  const [newCourse, setNewCourse] = useState(courses[0]?.id);
  const [newSemester, setNewSemester] = useState(semesters[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      PlannerAPI.getPlanner().then((plan) => {
        setSelected(plan.recommended)
        setLoading(false)
      })
    }, 10000)
  }, []);

  const handleSave = () => {
    PlannerAPI.updateSelectedPlan(selected)
    navigate('/dashboard')
  }

  const handleRemoveClick = (term: Term, course: Course) => {
    term.courses = term.courses.filter((c) => c.id !== course.id)
    setSelected([...selected])
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

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={["Generating recommended schedule"]} />
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true}/>
      <div className="planner-page">
        {selected.length !== 0 && (
          <>
          <div className="planner-component">
            <h4>Recommended Schedule</h4>
            <p>Add or remove courses from your upcoming schedule</p>
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
            <div className="planner-buttons">
              <button type="button" onClick={addCourse}>Add Course</button>
            </div>
          </div>
          </>)}
        {selected.length === 0 && (
          <section className="no-courses">
            <h4>Unable to generate recommended schedule at this time</h4>
            <p>Please try again later</p>
          </section>)}
      </div>
      <FooterBar />
    </>
  );
}