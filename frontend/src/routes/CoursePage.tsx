import { useParams } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAcademicDataContext } from '../context/useContext'

import './css/CoursePage.css'

export default function CoursePage() {
  const { courseId } = useParams()

  const { academicLoading, courses } = useAcademicDataContext()

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading courses...']} />
      </>
    )
  }

  const course = courses.find((c) => c.id === parseInt(courseId ?? ''))

  if (!course) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <div className="course-page">
          <section className="course-summary">
            <h3>Course Not Found</h3>
          </section>
        </div>
        <FooterBar />
      </>
    )
  }

  return (
    <>
      <HeaderBar isNavVisible={true} />
      <div className="course-page">
        <section className="course-summary">
          <div className="course-details">
            <table className="course-info">
              <tbody>
                <tr>
                  <td>Code</td>
                  <td>{course.code}</td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td>{course.title}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{course.description}</td>
                </tr>
                <tr>
                  <td>Prerequisites</td>
                  <td>{course.prerequisites ?? 'None'}</td>
                </tr>
                <tr>
                  <td>Units</td>
                  <td>{course.units}</td>
                </tr>
              </tbody>
            </table>
            <div className="action-btns">
              <button
                className="secondary"
                onClick={() => window.open(course.url, '_blank')}
              >
                View in Course Listings
              </button>
            </div>
          </div>
        </section>
        <section className="course-actions">
          <h3>Course Reviews</h3>
        </section>
      </div>
      <FooterBar />
    </>
  )
}
