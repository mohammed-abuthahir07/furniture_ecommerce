import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/Loader';

export function ProtectedCustomerRoute({ children }) {
  const { isCustomerAuthenticated, isCustomerLoading } = useAuth();
  const location = useLocation();

  if (isCustomerLoading) {
    return <PageLoader text="Authenticating customer..." />;
  }

  if (!isCustomerAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedCustomerRoute;
