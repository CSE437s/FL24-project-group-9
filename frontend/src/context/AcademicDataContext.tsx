import { createContext, ReactNode, useEffect, useState } from 'react'

import { Course } from '../models/Course'
import CoursesAPI from '../services/CoursesAPI'
import InterestsAPI from '../services/InterestsAPI'
import MajorsAPI from '../services/MajorsAPI'
import MinorsAPI from '../services/MinorsAPI'
import SemestersAPI from '../services/SemestersAPI'

interface AcademicDataContextType {
  courses: Course[]
  majors: string[]
  minors: string[]
  semesters: string[]
  interests: string[]
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(
  undefined
)

const AcademicDataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [majors, setMajors] = useState<string[]>([])
  const [minors, setMinors] = useState<string[]>([])
  const [semesters, setSemesters] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])

  useEffect(() => {
    CoursesAPI.getAllCourses().then(setCourses)
    MajorsAPI.getAllMajors().then(setMajors)
    MinorsAPI.getAllMinors().then(setMinors)
    SemestersAPI.getAllSemesters().then(setSemesters)
    InterestsAPI.getAllInterests().then(setInterests)
  }, [])

  return (
    <AcademicDataContext.Provider
      value={{ courses, majors, minors, semesters, interests }}
    >
      {children}
    </AcademicDataContext.Provider>
  )
}

export { AcademicDataContext, AcademicDataProvider }
