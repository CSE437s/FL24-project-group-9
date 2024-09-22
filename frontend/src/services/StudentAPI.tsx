import { API_URL } from './config.tsx'
import { Student } from '../models/Student.tsx'
import data from './data/student.json'

async function getStudent(): Promise<Student> {
  return data;
}

async function updateStudent(student: Student): Promise<Student> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({student}),
  }
  const response = await fetch(`${API_URL}/api/student/${student.id}`, options)
  return response.json()
}

export default { getStudent, updateStudent }