import React, { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
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
    console.log('draggin')
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

  const addCourses = (event: React.FormEvent) => {
    event.preventDefault()

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
    <Row className="planner-component">
      <Col md={5} className="add-course">
        <h4>Add Course</h4>
        <Form onSubmit={addCourses}>
          <Form.Group controlId="course" className="input-wrapper">
            <Form.Label>Course:</Form.Label>
            <Select
              multi
              options={courses}
              labelField="displayName"
              searchBy="displayName"
              valueField="id"
              values={newCourses}
              onChange={(values) => setNewCourses(values)}
              color="#a51416d0"
              clearable={true}
              required
            />
          </Form.Group>
          <Form.Group controlId="semester" className="input-wrapper">
            <Form.Label>Semester:</Form.Label>
            <Select
              options={semesters.filter((s) => s.isCompleted === isCompleted)}
              labelField="name"
              searchBy="name"
              valueField="id"
              values={[newSemester]}
              onChange={(values) => setNewSemester(values[0])}
              backspaceDelete={false}
              color="#555"
              required
            />
          </Form.Group>
          <Container>
            <Row>
              <Col md="auto">
                <Button type="submit">Add Course</Button>
              </Col>
              <Col md="auto">
                {!isCompleted ? (
                  <Button onClick={handleGenerate}>
                    Generate New Schedule
                  </Button>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </Container>
        </Form>
      </Col>
      <Col md={6} className="planner-body">
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
      </Col>
    </Row>
  )
}
