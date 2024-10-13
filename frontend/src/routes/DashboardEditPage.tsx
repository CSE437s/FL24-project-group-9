import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleRow } from '../components/ScheduleRow'
import { TermHeader } from '../components/TermHeader'
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
        <h3>Edit Course History</h3>
        <section className="course-summary">
          <div className="course-history">
            <h4>
              Course History
              <button className="secondary" onClick={handleSave}>
                Save
              </button>
            </h4>
            {semesters
              .filter((semester) => semester.isCompleted)
              .map((semester) => (
                <div key={semester.id}>
                  <TermHeader semester={semester} />
                  {semester.planned_courses.map((courseId) => (
                    <ScheduleRow
                      key={`${semester.id} ${courseId}`}
                      courseId={courseId}
                      handleRemoveClick={() =>
                        handleRemoveClick(semester, courseId)
                      }
                    />
                  ))}
                </div>
              ))}
            {semesters.length === 0 ? <h4>No Courses Added</h4> : <></>}
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
