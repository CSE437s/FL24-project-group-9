import { API_URL } from './config.tsx'

async function getAllDepartments(bearerToken: string): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/api/departments/`, options)
  return await response.json()
}

async function getDepartmentById(
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
  const response = await fetch(`${API_URL}/api/departments/${id}/`, options)
  return await response.json()
}

export default { getAllDepartments, getDepartmentById }
