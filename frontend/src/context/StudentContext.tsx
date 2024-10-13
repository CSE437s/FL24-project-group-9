import { createContext, ReactNode, useEffect, useState } from 'react'

import { Student } from '../models/Student'
import StudentAPI from '../services/StudentAPI'

import { useAuthContext } from './useContext'

interface StudentContextType {
  student: Student | null
  studentLoading: boolean
  getStudent: () => Promise<Student>
  updateStudent: (student: Student) => Promise<Student>
  hasStudentOnboarded: () => boolean
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

const StudentProvider = ({ children }: { children: ReactNode }) => {
  const authContext = useAuthContext()

  const [studentLoading, setStudentLoading] = useState(true)
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    if (authContext.bearerToken) {
      setStudentLoading(true)
      StudentAPI.getStudent(authContext.bearerToken)
        .then((response) => {
          setStudent(response)
        })
        .finally(() => {
          setStudentLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setStudentLoading(false)
        })
    }
  }, [authContext])

  const getStudent = async (): Promise<Student> => {
    const response = await StudentAPI.getStudent(authContext.bearerToken)
    setStudent(response)
    return response
  }

  const updateStudent = async (student: Student): Promise<Student> => {
    const response = await StudentAPI.updateStudent(
      authContext.bearerToken,
      student
    )
    setStudent(response)
    return response
  }

  const hasStudentOnboarded = (): boolean => {
    return (
      student !== null && student.programs?.length !== 0 && student.grad !== ''
    )
  }

  return (
    <StudentContext.Provider
      value={{
        student,
        studentLoading,
        getStudent,
        updateStudent,
        hasStudentOnboarded,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export { StudentContext, StudentProvider }
