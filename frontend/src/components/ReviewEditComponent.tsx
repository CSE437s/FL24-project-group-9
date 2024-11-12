import { useState } from 'react'
import { Col, Container, Form } from 'react-bootstrap'

import { useAuthContext } from '../context/useContext'
import { Review } from '../models/Review'
import ReviewsAPI from '../services/ReviewsAPI'

interface ReviewEditComponentProps {
  courseId: number
  review?: Review
  showCreate?: boolean
  isEditable?: boolean
  setShowCreate?: React.Dispatch<React.SetStateAction<boolean>>
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
}

export const ReviewEditComponent: React.FC<ReviewEditComponentProps> = ({
  courseId,
  review = { course: courseId, rating: 1, comments: '' },
  showCreate = false,
  isEditable = false,
  setShowCreate,
  setReviews,
}) => {
  const { bearerToken } = useAuthContext()

  const [showEdit, setShowEdit] = useState(showCreate)
  const [newReview, setNewReview] = useState(review)

  const createReview = async (review: Review) => {
    ReviewsAPI.createReview(bearerToken, review).then((response) => {
      setReviews((reviews: Review[]) => [response, ...reviews])
    })
  }

  const updateReview = async (review: Review) => {
    ReviewsAPI.updateReview(bearerToken, review).then((response) => {
      setReviews((reviews: Review[]) =>
        reviews.map((r) => (r.id === response.id ? response : r))
      )
    })
  }

  const deleteReview = async (id: number) => {
    ReviewsAPI.deleteReview(bearerToken, id).then(() => {
      setReviews((reviews: Review[]) => reviews.filter((r) => r.id !== id))
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (showCreate) {
      if (!setShowCreate) {
        return
      }
      createReview(newReview).then(() => setShowCreate(false))
    } else {
      updateReview(newReview).then(() => setShowEdit(false))
    }
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    if (setShowCreate) {
      setShowCreate(false)
    } else {
      setShowEdit(false)
    }
  }

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault()
    if (review.id) {
      deleteReview(review.id)
    }
  }

  const getColor = (rating: number) => {
    if (rating >= 4) return 'good'
    if (rating >= 3) return 'neutral'
    return 'bad'
  }

  if (!showEdit) {
    return (
      <Container className="review-block">
        <Col md="auto" className="review-header">
          <span>Rating</span>
          <div className={`review-rating ${getColor(review.rating)}`}>
            {review.rating} / 5
          </div>
        </Col>
        <Col className="review-body">
          <span>Comment</span>
          <div className="review-comments">{review.comments}</div>
          {isEditable && (
            <div className="review-actions">
              <button className="secondary" onClick={() => setShowEdit(true)}>
                Edit
              </button>
            </div>
          )}
        </Col>
      </Container>
    )
  }

  return (
    <Form className="review-block editable-review-block" onSubmit={handleSave}>
      <Col md="auto" className="review-header">
        <Form.Group controlId="rating">
          <Form.Label>Rating</Form.Label>
          <Form.Control
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
        </Form.Group>
      </Col>
      <Col className="review-body">
        <Form.Group controlId="comments">
          <Form.Label>Write a Comment</Form.Label>
          <Form.Control
            as="textarea"
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
            {review.id !== undefined && (
              <button className="secondary" onClick={handleDelete}>
                Delete
              </button>
            )}
            <button className="secondary" type="submit">
              Save
            </button>
          </div>
        </Form.Group>
      </Col>
    </Form>
  )
}
