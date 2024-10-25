import { createContext, ReactNode, useEffect, useState } from 'react'

import { Course } from '../models/Course'
import { Department } from '../models/Department'
import { Program } from '../models/Program'
import CoursesAPI from '../services/CoursesAPI'
import DepartmentsAPI from '../services/DepartmentsAPI'
import ProgramsAPI from '../services/ProgramsAPI'

import { useAuthContext } from './useContext'

interface AcademicDataContextType {
  academicLoading: boolean
  courses: Course[]
  departments: Department[]
  programs: Program[]
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(
  undefined
)

const AcademicDataProvider = ({ children }: { children: ReactNode }) => {
  const { bearerToken } = useAuthContext()
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [academicLoading, setAcademicLoading] = useState(true)

  useEffect(() => {
    if (bearerToken) {
      const fetchData = async () => {
        try {
          await Promise.all([
            CoursesAPI.getAllCourses(bearerToken).then(setCourses),
            DepartmentsAPI.getAllDepartments(bearerToken).then(setDepartments),
            ProgramsAPI.getAllPrograms(bearerToken).then(setPrograms),
          ])
        } catch (error) {
          console.error(error)
        } finally {
          setAcademicLoading(false)
        }
      }

      fetchData()
    }
  }, [bearerToken])

  return (
    <AcademicDataContext.Provider
      value={{
        academicLoading,
        courses,
        departments,
        programs,
      }}
    >
      {children}
    </AcademicDataContext.Provider>
  )
}

export { AcademicDataContext, AcademicDataProvider }
