import React, { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import Select from 'react-dropdown-select'

import {
  useAcademicDataContext,
  useStudentContext,
} from '../context/useContext'
import { Course } from '../models/Course'
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
  const [newCourses, setNewCourses] = useState<Course[]>([])
  const [newSemester, setNewSemester] = useState(
    semesters.filter((s) => s.isCompleted == isCompleted)?.[0]
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

  const addCourses = () => {
    const semester = semesters.find(
      (semester) => semester.id === newSemester.id
    )

    if (!semester) {
      return
    }

    newCourses.forEach((newCourse) => {
      const course = courses.find((course) => course.id === newCourse.id)

      // non-existent course or course already in semester
      if (!course || semester.planned_courses.find((c) => c === course.id)) {
        return
      }

      semester.planned_courses.push(course.id)
    })

    updateSemester(semester)
  }

  return (
    <div className="planner-component">
      <div className="add-course">
        <h4>Add Course</h4>
        <p>
          <label>Course:</label>
          <div className="select-dropdown-wrapper">
            <Select
              multi
              options={courses}
              labelField="displayName"
              searchBy="displayName"
              valueField="id"
              values={[courses[0]]}
              onChange={(values) => setNewCourses(values)}
              color="#555"
              clearable={true}
            />
          </div>
        </p>
        <p>
          <label>Semester:</label>
          <div className="select-dropdown-wrapper">
            <Select
              options={semesters.filter((s) => s.isCompleted === isCompleted)}
              labelField="name"
              searchBy="name"
              valueField="id"
              values={[newSemester]}
              onChange={(values) => setNewSemester(values[0])}
              backspaceDelete={false}
              color="#555"
            />
          </div>
        </p>
        <div className="planner-buttons">
          <button type="button" onClick={addCourses}>
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
