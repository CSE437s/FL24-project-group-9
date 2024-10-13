import { Program } from '../models/Program.tsx'

import { API_URL } from './config.tsx'

async function getAllPrograms(bearerToken: string): Promise<Program[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/programs/`, options)
  return await response.json()
}

async function getProgramById(
  bearerToken: string,
  id: string
): Promise<Program> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/programs/${id}/`, options)
  return await response.json()
}

export default { getAllPrograms, getProgramById }
