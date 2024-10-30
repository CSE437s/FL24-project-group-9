import { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

import { useAuthContext } from '../context/useContext'
import { Review } from '../models/Review'
import ReviewsAPI from '../services/ReviewsAPI'

import './css/ReviewsComponent.css'

interface ReviewsComponentProps {
  courseId: string
}

export const ReviewsComponent: React.FC<ReviewsComponentProps> = ({
  courseId,
}) => {
  const { bearerToken } = useAuthContext()

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewLoading, setReviewLoading] = useState(true)

  useEffect(() => {
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

  const getColor = (rating: number) => {
    if (rating >= 4) return 'good'
    if (rating >= 3) return 'neutral'
    return 'bad'
  }

  return (
    <div className="reviews">
      {reviews.map((review) => (
        <div key={review.id} className="review-block">
          <div className="review-header">
            <span>Rating</span>
            <div className={`review-rating ${getColor(review.rating)}`}>
              {review.rating} / 5
            </div>
          </div>
          <div className="review-body">
            <span>Comment</span>{' '}
            <div className="review-comments">{review.comments}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
