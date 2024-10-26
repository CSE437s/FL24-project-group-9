import { createContext, ReactNode, useEffect, useState } from 'react'

import { Semester } from '../models/Semester'
import { Student } from '../models/Student'
import SemestersAPI from '../services/SemestersAPI'
import StudentAPI from '../services/StudentAPI'

import { useAuthContext } from './useContext'

interface StudentContextType {
  student: Student | null
  studentLoading: boolean
  semesters: Semester[]
  getStudent: () => Promise<Student>
  updateStudent: (student: Student) => Promise<Student>
  hasStudentOnboarded: () => boolean
  updateSemester: (semester: Semester) => void
  hasPreviousSemesters: () => boolean
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

const StudentProvider = ({ children }: { children: ReactNode }) => {
  const { bearerToken } = useAuthContext()

  const [studentLoading, setStudentLoading] = useState(true)
  const [student, setStudent] = useState<Student | null>(null)
  const [semesters, setSemesters] = useState<Semester[]>([])

  useEffect(() => {
    if (bearerToken) {
      setStudentLoading(true)
      StudentAPI.getStudent(bearerToken)
        .then(async (response) => {
          setStudent(response)
          await SemestersAPI.getAllSemesters(bearerToken).then(setSemesters)
        })
        .finally(() => {
          setStudentLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setStudentLoading(false)
        })
    }
  }, [bearerToken])

  const getStudent = async (): Promise<Student> => {
    const response = await StudentAPI.getStudent(bearerToken)
    setStudent(response)
    return response
  }

  const updateStudent = async (student: Student): Promise<Student> => {
    setStudentLoading(true)

    StudentAPI.updateStudent(bearerToken, student)
      .then(async (response) => {
        setStudent(response)
        await getAllSemesters()
      })
      .finally(() => {
        setStudentLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setStudentLoading(false)
      })

    return student
  }

  const hasStudentOnboarded = (): boolean => {
    return (
      student !== null && student.programs?.length !== 0 && student.grad !== ''
    )
  }

  const getAllSemesters = async () => {
    SemestersAPI.getAllSemesters(bearerToken).then(setSemesters)
  }

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

  const hasPreviousSemesters = () => {
    return semesters.filter((s) => s.isCompleted).length > 0
  }

  return (
    <StudentContext.Provider
      value={{
        student,
        studentLoading,
        semesters,
        getStudent,
        updateStudent,
        hasStudentOnboarded,
        updateSemester,
        hasPreviousSemesters,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export { StudentContext, StudentProvider }
