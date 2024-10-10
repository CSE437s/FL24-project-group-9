import { Course } from '../models/Course.tsx'

import { API_URL } from './config.tsx'

async function getAllCourses(bearerToken: string): Promise<Course[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/courses/`, options)
  return await response.json()
}

async function getCourseById(bearerToken: string, id: string): Promise<Course> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/courses/${id}/`, options)
  return await response.json()
}

export default { getAllCourses, getCourseById }
