import { API_URL } from './config.tsx'

async function getAllMinors(bearerToken: string): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
  }
  const response = await fetch(`${API_URL}/api/minors/`, options)
  return await response.json();
}

async function getMinorById(bearerToken: string, id: string): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
  }
  const response = await fetch(`${API_URL}/api/minors/${id}/`, options)
  return await response.json();
}

export default { getAllMinors, getMinorById }