import React, { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import {
  useAcademicDataContext,
  useStudentContext,
} from '../context/useContext'
import { Semester } from '../models/Semester'

import { ScheduleDraggableV2 } from './ScheduleDraggableV2'

import './css/PlannerComponent.css'

interface PlannerComponentProps {
  isCompleted?: boolean
}

export const PlannerComponent: React.FC<PlannerComponentProps> = ({
  isCompleted = false,
}) => {
  const { courses } = useAcademicDataContext()
  const { semesters, updateSemester, generateSemesters } = useStudentContext()
  const [newCourse, setNewCourse] = useState(courses[0]?.id)
  const [newSemester, setNewSemester] = useState(
    semesters.filter((s) => s.isCompleted == isCompleted)[0]?.id
  )

  const handleGenerate = () => {
    generateSemesters()
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

    if (destinationSemester.planned_courses.includes(movedCourse)) {
      return
    }

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

    if (!course || !semester) {
      return
    }

    if (semester.planned_courses.find((c) => c === course.id)) {
      return
    }

    semester.planned_courses.push(course.id)
    updateSemester(semester)
  }

  return (
    <div className="planner-component">
      <div className="add-course">
        <h4>Add Course</h4>
        <p>
          <label>Course:</label>
          <select
            value={newCourse}
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
              semesters
                .filter((s) => s.isCompleted === isCompleted)
                .map((semester, index) => (
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
      <div className="planner-body">
        {!isCompleted ? (
          <button onClick={handleGenerate}>Generate New Schedule</button>
        ) : (
          <></>
        )}
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className="selected-block">
            {semesters &&
              semesters
                .filter((s) => s.isCompleted === isCompleted)
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
    </div>
  )
}
