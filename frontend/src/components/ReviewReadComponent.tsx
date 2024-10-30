import { Review } from '../models/Review'

interface ReviewReadComponentProps {
  review: Review
}

export const ReviewReadComponent: React.FC<ReviewReadComponentProps> = ({
  review,
}) => {
  const getColor = (rating: number) => {
    if (rating >= 4) return 'good'
    if (rating >= 3) return 'neutral'
    return 'bad'
  }

  return (
    <div className="review-block">
      <div className="review-header">
        <span>Rating</span>
        <div className={`review-rating ${getColor(review.rating)}`}>
          {review.rating} / 5
        </div>
      </div>
      <div className="review-body">
        <span>Comment</span>
        <div className="review-comments">{review.comments}</div>
      </div>
    </div>
  )
}
