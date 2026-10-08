import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/Loader';

// For Login/Register pages when already authenticated
export function PublicOnlyRoute({ children, redirectTo = '/account' }) {
  const { isCustomerAuthenticated, isCustomerLoading } = useAuth();

  if (isCustomerLoading) {
    return <PageLoader text="Loading..." />;
  }

  if (isCustomerAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default PublicOnlyRoute;
