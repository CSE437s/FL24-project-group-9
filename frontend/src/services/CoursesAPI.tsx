import { Course } from '../models/Course.tsx'

import data from './data/courses.json'
import { API_URL } from './config.tsx'

async function getAllCourses(): Promise<Course[]> {
  return data
}

async function getCourseById(id: string): Promise<Course> {
  const response = await fetch(`${API_URL}/api/courses/${id}`)
  return await response.json()
}

export default { getAllCourses, getCourseById }