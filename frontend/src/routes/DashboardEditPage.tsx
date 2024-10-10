import { useEffect, useState } from 'react'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { ScheduleRow } from '../components/ScheduleRow'
import { TermHeader } from '../components/TermHeader'
import { useAcademicDataContext, useAuthContext } from '../context/useContext'
import { Course, Term } from '../models/Course'
import PlannerAPI from '../services/PlannerAPI'
import { utils } from '../utils'

import './css/DashboardEditPage.css'

export default function DashboardEditPage() {
  const { courses, semesters } = useAcademicDataContext()
  const { bearerToken } = useAuthContext()
  const [taken, setTaken] = useState<Term[]>([])
  const [newCourse, setNewCourse] = useState(courses[0]?.id)
  const [newSemester, setNewSemester] = useState(semesters[0])

  useEffect(() => {
    PlannerAPI.getPlanner().then((plan) => {
      setTaken(plan.taken)
    })
  }, [bearerToken])

  const handleRemoveClick = (term: Term, course: Course) => {
    term.courses = term.courses.filter((c) => c.id !== course.id)
    setTaken([...taken])

    if (term.courses.length === 0) {
      setTaken(taken.filter((t) => t.id !== term.id))
    }
  }

  const handleSave = () => {
    PlannerAPI.updateTakenPlan(taken) // TODO: handle API
  }

  const addCourse = () => {
    const term = taken.find((term) => term.term === newSemester)
    const course = courses.find((course) => course.id === newCourse)

    if (!course) {
      return
    }

    if (term) {
      if (term.courses.find((c) => c.id === course.id)) {
        return
      }
      term.courses.push(course)
      setTaken([...taken])
    } else {
      const newTerm = {
        id: (
          Math.max(...taken.map((term) => parseInt(term.id))) + 1
        ).toString(),
        term: newSemester,
        courses: [course],
      }
      setTaken(utils.sortTermObjects([...taken, newTerm]))
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
            {taken.map((term) => (
              <div key={term.id}>
                <TermHeader term={term} />
                {term.courses.map((course) => (
                  <ScheduleRow
                    key={`${term.id} ${course.id}`}
                    course={course}
                    handleRemoveClick={() => handleRemoveClick(term, course)}
                  />
                ))}
              </div>
            ))}
            {taken.length === 0 ? <h4>No Courses Added</h4> : <></>}
          </div>
          <div className="add-course">
            <h4>Add a Course</h4>
            <p>
              <label>Course:</label>
              <select
                defaultValue={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
              >
                {courses.map((course, index) => (
                  <option key={index} value={course.id}>
                    {course.department} {course.code} - {course.title}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <label>Semester:</label>
              <select
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value)}
              >
                {semesters.map((semester, index) => (
                  <option key={index} value={semester}>
                    {semester}
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
