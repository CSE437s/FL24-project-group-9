import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/useContext';
import { HeaderBar } from '../components/HeaderBar';
import { SpinnerComponent } from '../components/SpinnerComponent';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, bearerToken } = useAuthContext();

  if (loading) {
    return (
      <>
        <HeaderBar isNavVisible={true}/>
        <SpinnerComponent messages={[""]} />
      </>
    )
  }

  if (!bearerToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;