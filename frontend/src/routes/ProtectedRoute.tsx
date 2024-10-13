import { Navigate } from 'react-router-dom'

import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import {
  useAcademicDataContext,
  useAuthContext,
  useStudentContext,
} from '../context/useContext'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
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

  if (!hasStudentOnboarded()) {
    return <Navigate to="/onboarding" />
  }

  if (!bearerToken) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
