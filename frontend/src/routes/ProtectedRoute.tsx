import { Navigate } from 'react-router-dom'

import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAuthContext, useStudentContext } from '../context/useContext'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, bearerToken } = useAuthContext()
  const { studentLoading, hasStudentOnboarded } = useStudentContext()

  if (loading || studentLoading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['']} />
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
