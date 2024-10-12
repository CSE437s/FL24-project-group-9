import { Course } from './Course'

export type Semester = {
  id: number
  name: string
  planned_credits: number
  isCompleted: boolean
  student: number
  planned_courses: Course[]
}
