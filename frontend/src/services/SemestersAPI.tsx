import { Semester } from '../models/Semester.tsx'

import { API_URL } from './config.tsx'

async function getAllSemesters(bearerToken: string): Promise<Semester[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/semesters/`, options)
  return await response.json()
}

async function updateSemester(
  bearerToken: string,
  semester: Semester
): Promise<Semester> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(semester),
  }
  const response = await fetch(
    `${API_URL}/api/semesters/${semester.id}?expand=planned_courses`,
    options
  )
  return await response.json()
}

export default { getAllSemesters, updateSemester }
