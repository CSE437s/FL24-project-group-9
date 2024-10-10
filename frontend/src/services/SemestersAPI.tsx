import { API_URL } from './config.tsx'

async function getAllSemesters(bearerToken: string): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
  }
  const response = await fetch(`${API_URL}/api/semesters/`, options)
  return await response.json();
}

export default { getAllSemesters }
