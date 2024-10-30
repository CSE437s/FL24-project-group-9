import { useState } from 'react'

import { Review } from '../models/Review'

interface ReviewEditComponentProps {
  courseId: number
  review?: Review
  handleCreate?: (review: Review) => void
  handleUpdate?: (review: Review) => void
  handleDelete?: (reviewId: number) => void
  handleCancel: () => void
}

export const ReviewEditComponent: React.FC<ReviewEditComponentProps> = ({
  courseId,
  review,
  handleCreate,
  handleUpdate,
  handleCancel,
}) => {
  const [newReview, setNewReview] = useState(
    review ?? { course: courseId, rating: 1, comments: '' }
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (handleCreate) {
      handleCreate(newReview)
    } else if (handleUpdate) {
      handleUpdate(newReview)
    }
  }

  return (
    <form className="review-block editable-review-block" onSubmit={handleSave}>
      <div className="review-header">
        <span>Rating</span>
        <input
          type="number"
          value={newReview.rating}
          min="1"
          max="5"
          step={1}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: parseInt(e.target.value) })
          }
          className="review-rating"
          required
        />
      </div>
      <div className="review-body">
        <span>Write a Comment</span>
        <textarea
          className="review-comments"
          minLength={10}
          value={newReview.comments}
          onChange={(e) =>
            setNewReview({ ...newReview, comments: e.target.value })
          }
          required
        />
        <div className="review-actions">
          <button className="secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="secondary" type="submit">
            Save
          </button>
        </div>
      </div>
    </form>
  )
}
