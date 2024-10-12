import { createContext, ReactNode, useEffect, useState } from 'react'

import { Course } from '../models/Course'
import { Department } from '../models/Department'
import { Program } from '../models/Program'
import { Semester } from '../models/Semester'
import CoursesAPI from '../services/CoursesAPI'
import DepartmentsAPI from '../services/DepartmentsAPI'
import ProgramsAPI from '../services/ProgramsAPI'
import SemestersAPI from '../services/SemestersAPI'

import { useAuthContext } from './useContext'

interface AcademicDataContextType {
  courses: Course[]
  departments: Department[]
  programs: Program[]
  semesters: Semester[]
  updateSemester: (semester: Semester) => void
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(
  undefined
)

const AcademicDataProvider = ({ children }: { children: ReactNode }) => {
  const { bearerToken } = useAuthContext()
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])

  useEffect(() => {
    if (bearerToken) {
      CoursesAPI.getAllCourses(bearerToken).then(setCourses)
      DepartmentsAPI.getAllDepartments(bearerToken).then(setDepartments)
      ProgramsAPI.getAllPrograms(bearerToken).then(setPrograms)
      SemestersAPI.getAllSemesters(bearerToken).then(setSemesters)
    }
  }, [bearerToken])

  const updateSemester = (semester: Semester) => {
    SemestersAPI.updateSemester(bearerToken, semester).then(
      (updatedSemester) => {
        setSemesters((prevSemesters) =>
          prevSemesters.map((s) =>
            s.id === updatedSemester.id ? updatedSemester : s
          )
        )
      }
    )
  }

  return (
    <AcademicDataContext.Provider
      value={{ courses, departments, programs, semesters, updateSemester }}
    >
      {children}
    </AcademicDataContext.Provider>
  )
}

export { AcademicDataContext, AcademicDataProvider }
