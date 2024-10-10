import { Student } from '../models/Student.tsx'
import { API_URL } from './config.tsx';

async function getStudent(bearerToken: string): Promise<Student> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
  }
  const response = await fetch(`${API_URL}/api/student`, options)
  console.log(await response.json())
  return await response.json();
}

async function updateStudent(bearerToken: string, student: Student): Promise<Student> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
    body: JSON.stringify({ student }),
  }
  const response = await fetch(`${API_URL}/api/student/`, options)
  return response.json()
}

export default { getStudent, updateStudent }
