import { Course } from '../models/Course.tsx';
// import { API_URL } from './config.tsx'
import data from './data/courses.json'

async function getAllCourses(): Promise<Course[]> {
  return data;
}

export default { getAllCourses }