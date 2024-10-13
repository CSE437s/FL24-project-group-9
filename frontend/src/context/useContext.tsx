import { useContext } from 'react'

import { AcademicDataContext } from './AcademicDataContext'
import { AuthContext } from './AuthContext'
import { StudentContext } from './StudentContext'

const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

const useAcademicDataContext = () => {
  const context = useContext(AcademicDataContext)
  if (!context) {
    throw new Error(
      'useAcademicData must be used within an AcademicDataProvider'
    )
  }
  return context
}

const useStudentContext = () => {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider')
  }
  return context
}

export { useAcademicDataContext, useAuthContext, useStudentContext }
