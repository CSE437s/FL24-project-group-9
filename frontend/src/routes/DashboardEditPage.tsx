import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleDraggableV2 } from '../components/ScheduleDraggableV2'
import { useAcademicDataContext } from '../context/useContext'
import { Semester } from '../models/Semester'

import './css/DashboardEditPage.css'

export default function DashboardEditPage() {
  const navigate = useNavigate()
  const { courses, semesters, updateSemester } = useAcademicDataContext()
  const [newCourse, setNewCourse] = useState(courses[0]?.id)
  const [newSemester, setNewSemester] = useState(semesters[0]?.id)

  const handleRemoveClick = (semester: Semester, courseId: number) => {
    const curSemester = semesters.find((s) => s.id === semester.id)
    if (curSemester) {
      curSemester.planned_courses = curSemester.planned_courses.filter(
        (c) => c !== courseId
      )
      updateSemester(curSemester)
    }
  }

  const handleSave = () => {
    navigate('/dashboard')
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
    const curSemester = semesters.find((s) => s.id === newSemester)
    if (curSemester) {
      const curCourse = courses.find((c) => c.id === newCourse)
      if (curCourse) {
        curSemester.planned_courses.push(curCourse.id)
        updateSemester(curSemester)
      }
    }
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="dashboard-edit-page">
        <section className="course-summary">
          <div className="course-history">
            <h4>
              Course History
              <button className="secondary" onClick={handleSave}>
                Save
              </button>
            </h4>
            <p>Add or remove courses from your previous schedule</p>
            <DragDropContext onDragEnd={handleDragDrop}>
              <div className="selected-block">
                {semesters &&
                  semesters
                    .filter((semesters) => semesters.isCompleted)
                    .map((semester) => (
                      <ScheduleDraggableV2
                        key={semester.id}
                        droppableId={semester.id.toString()}
                        semester={semester}
                        handleRemoveClick={handleRemoveClick}
                      />
                    ))}
              </div>
            </DragDropContext>
          </div>
          <div className="add-course">
            <h4>Add a Course</h4>
            <p>
              <label>Course:</label>
              <select
                defaultValue={newCourse}
                onChange={(e) => setNewCourse(Number(e.target.value))}
              >
                {courses.map((course, index) => (
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
                {semesters.map((semester, index) => (
                  <option key={index} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </p>
            <div className="edit-buttons">
              <button type="button" onClick={addCourse}>
                Add Course
              </button>
            </div>
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}
