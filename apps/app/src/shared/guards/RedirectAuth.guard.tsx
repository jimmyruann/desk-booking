import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/Authentication.context';

export function RedirectAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return <div>Loading Page ...</div>;
  }

  if (!auth.isLoading && auth.user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RedirectAuth;
