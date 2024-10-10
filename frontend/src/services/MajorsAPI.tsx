import { API_URL } from './config.tsx'

async function getAllMajors(bearerToken: string): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/majors/`, options)
  return await response.json()
}

async function getMajorById(
  bearerToken: string,
  id: string
): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/majors/${id}/`, options)
  return await response.json()
}

export default { getAllMajors, getMajorById }
