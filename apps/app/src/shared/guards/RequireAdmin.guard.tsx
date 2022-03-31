import { UserRole } from '@prisma/client';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/Authentication.context';

export function RequireAdmin() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return <div>Loading Page ...</div>;
  }

  if (!auth.isLoading && !auth.user) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (!auth.user.roles.includes(UserRole.ADMIN)) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAdmin;
