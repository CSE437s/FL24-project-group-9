import { Navigate, useLocation } from 'react-router-dom'

import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import {
  useAcademicDataContext,
  useAuthContext,
  useStudentContext,
} from '../context/useContext'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()

  const { loading, bearerToken } = useAuthContext()
  const { studentLoading, hasStudentOnboarded } = useStudentContext()
  const { academicLoading } = useAcademicDataContext()

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Initializing Application...']} />
      </>
    )
  }

  if (!bearerToken) {
    return <Navigate to="/login" />
  }

  if (studentLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading student info...']} />
      </>
    )
  }

  if (academicLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['Loading academic data...']} />
      </>
    )
  }

  if (!hasStudentOnboarded() && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />
  }

  if (hasStudentOnboarded() && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" />
  }

  return children
}

export default ProtectedRoute
