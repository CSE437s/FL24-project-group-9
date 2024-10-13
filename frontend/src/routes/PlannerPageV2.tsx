import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleDraggableV2 } from '../components/ScheduleDraggableV2'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { TermHeader } from '../components/TermHeader'
import { useAcademicDataContext } from '../context/useContext'
import { Semester } from '../models/Semester'

import './css/PlannerPageV2.css'

export default function PlannerPageV2() {
  const navigate = useNavigate()
  const { loading, courses, semesters, updateSemester } =
    useAcademicDataContext()
  const [newCourse, setNewCourse] = useState(courses[0]?.id)
  const [newSemester, setNewSemester] = useState(semesters[0]?.id)

  const handleSave = () => {
    navigate('/dashboard')
  }

  const handleRemoveClick = (semester: Semester, courseId: number) => {
    semester.planned_courses = semester.planned_courses.filter(
      (c) => c !== courseId
    )
    updateSemester(semester)
  }

  const handleDragDrop = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return
    }

    const sourceSemesterId = Number(source.droppableId)
    const destinationSemesterId = Number(destination.droppableId)

    const sourceSemester = semesters.find(
      (semester) => semester.id === sourceSemesterId
    )
    const destinationSemester = semesters.find(
      (semester) => semester.id === destinationSemesterId
    )

    if (!sourceSemester || !destinationSemester) {
      return
    }

    const [movedCourse] = sourceSemester.planned_courses.splice(source.index, 1)
    destinationSemester.planned_courses.splice(
      destination.index,
      0,
      movedCourse
    )

    updateSemester(sourceSemester)
  }

  const addCourse = () => {
    const semester = semesters.find((semester) => semester.id === newSemester)
    const course = courses.find((course) => course.id === newCourse)

    if (!course) {
      return
    }

    if (semester) {
      if (semester.planned_courses.find((c) => c === course.id)) {
        return
      }
      semester.planned_courses.push(course.id)
      updateSemester(semester)
    }
  }

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Generating recommended schedule']} />
        <FooterBar />
      </>
    )
  }

  if (semesters.length === 0) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <section className="no-courses">
          <h4>Unable to generate recommended schedule at this time</h4>
          <p>Please try again later</p>
        </section>{' '}
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="planner-page">
        <div className="planner-component">
          <h4>Recommended Schedule</h4>
          <p>Add or remove courses from your upcoming schedule</p>
          <DragDropContext onDragEnd={handleDragDrop}>
            <div className="selected-block">
              {semesters &&
                semesters
                  .filter((semesters) => !semesters.isCompleted)
                  .map((semester) => (
                    <div key={semester.id} className="schedule-term">
                      <TermHeader semester={semester} />
                      <ScheduleDraggableV2
                        semester={semester}
                        droppableId={`${semester.id}`}
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
              onChange={(e) => setNewCourse(Number(e.target.value))}
            >
              {courses &&
                courses.map((course, index) => (
                  <option key={index} value={course.id}>
                    {course.code.substring(3)} - {course.title}
                  </option>
                ))}
            </select>
          </p>
          <p>
            <label>Semester:</label>
            <select
              value={newSemester}
              onChange={(e) => setNewSemester(Number(e.target.value))}
            >
              {semesters &&
                semesters.map((semester, index) => (
                  <option key={index} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
            </select>
          </p>
          <div className="planner-buttons">
            <button type="button" onClick={addCourse}>
              Add Course
            </button>
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  )
}
