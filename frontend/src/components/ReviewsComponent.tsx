import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

import { useAuthContext, useStudentContext } from '../context/useContext'
import { Review } from '../models/Review'
import ReviewsAPI from '../services/ReviewsAPI'

import { ReviewEditComponent } from './ReviewEditComponent'

import './css/ReviewsComponent.css'

interface ReviewsComponentProps {
  courseId: number
}

export const ReviewsComponent: React.FC<ReviewsComponentProps> = ({
  courseId,
}) => {
  const { bearerToken } = useAuthContext()

  const { student } = useStudentContext()
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewLoading, setReviewLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    ReviewsAPI.getAllReviews(bearerToken, courseId)
      .then((response) => {
        const sortedReviews = response.sort(
          (a: Review, b: Review) => (b.id ?? 0) - (a.id ?? 0)
        )
        setReviews(sortedReviews)
      })
      .finally(() => {
        setReviewLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load reviews:', error)
      })
  }, [bearerToken, courseId])

  if (reviewLoading) {
    return <ClipLoader size={35} color={'#123abc'} loading={true} />
  }

  if (!reviews.length) {
    return (
      <div className="reviews">
        <p className="no-reviews">No reviews found</p>
      </div>
    )
  }

  return (
    <div className="reviews">
      <button
        className="create-review"
        onClick={() => setShowCreate(true)}
        disabled={showCreate}
      >
        Add a Review
      </button>
      {showCreate && (
        <ReviewEditComponent
          courseId={courseId}
          showCreate={true}
          isEditable={true}
          setReviews={setReviews}
          setShowCreate={setShowCreate}
        />
      )}
      {reviews.map((review) => (
        <ReviewEditComponent
          key={review.id}
          courseId={courseId}
          review={review}
          isEditable={student?.id === review.student}
          setReviews={setReviews}
        />
      ))}
    </div>
  )
}
