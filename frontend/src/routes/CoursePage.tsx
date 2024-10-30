import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { FooterBar } from '../components/FooterBar'
import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAcademicDataContext, useAuthContext } from '../context/useContext'
import { Review } from '../models/Review'
import ReviewsAPI from '../services/ReviewsAPI'

import './css/CoursePage.css'

export default function CoursePage() {
  const { courseId } = useParams()

  const { bearerToken } = useAuthContext()
  const { academicLoading, courses } = useAcademicDataContext()
  const course = courses.find((c) => c.id === parseInt(courseId ?? ''))

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewLoading, setReviewLoading] = useState(true)
  console.log(bearerToken)
  useEffect(() => {
    if (!courseId) return

    ReviewsAPI.getAllReviews(bearerToken, courseId)
      .then((data) => {
        setReviews(data)
      })
      .finally(() => {
        setReviewLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load reviews:', error)
      })
  }, [bearerToken, courseId])

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading courses...']} />
      </>
    )
  }

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
          <div className="reviews">
            {reviewLoading ? (
              <SpinnerComponent messages={['Loading reviews...']} />
            ) : reviews.length ? (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <div className="review-header">
                    <div className="rating">{review.rating}/5</div>
                  </div>
                  <div className="review-body">{review.comments}</div>
                </div>
              ))
            ) : (
              <div className="no-reviews">No reviews found</div>
            )}
          </div>
        </section>
      </div>
      <FooterBar />
    </>
  )
}
