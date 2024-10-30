import { Review } from '../models/Review.tsx'

import { API_URL } from './config.tsx'

async function getAllReviews(
  bearerToken: string,
  courseId: string
): Promise<Review[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(
    `${API_URL}/api/reviews/?course_id=${courseId}`,
    options
  )
  return await response.json()
}

async function createReview(
  bearerToken: string,
  review: Review
): Promise<null> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(review),
  }
  const response = await fetch(`${API_URL}/api/reviews/`, options)
  return await response.json()
}

async function updateReview(
  bearerToken: string,
  review: Review
): Promise<null> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(review),
  }
  const response = await fetch(`${API_URL}/api/reviews/${review.id}`, options)
  return await response.json()
}

async function deleteReview(
  bearerToken: string,
  review: Review
): Promise<null> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(review),
  }
  const response = await fetch(`${API_URL}/api/reviews/${review.id}`, options)
  return await response.json()
}

export default { getAllReviews, createReview, updateReview, deleteReview }
