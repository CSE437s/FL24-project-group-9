import { Navigate } from 'react-router-dom'

import { HeaderBar } from '../components/HeaderBar'
import { SpinnerComponent } from '../components/SpinnerComponent'
import { useAuthContext } from '../context/useContext'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, bearerToken } = useAuthContext()

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true} />
        <SpinnerComponent messages={['']} />
      </>
    )
  }

  if (!bearerToken) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute
