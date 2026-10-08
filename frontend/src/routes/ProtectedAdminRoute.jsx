import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/Loader';

export function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated, isAdminLoading } = useAuth();
  const location = useLocation();

  if (isAdminLoading) {
    return <PageLoader text="Authenticating administrator..." />;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedAdminRoute;
