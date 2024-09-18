import { Student } from '../models/Student.tsx'
// import { API_URL } from './config.tsx'
import data from './data/students.json'

async function getStudent(): Promise<Student> {
  return data;
}

export default { getStudent }