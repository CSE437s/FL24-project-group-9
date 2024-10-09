import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/useContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { bearerToken } = useAuthContext();

  if (!bearerToken) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;