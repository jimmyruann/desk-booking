import { Navigate, useLocation } from 'react-router';
import AppLayout from '../components/app-layout/app-layout';
import { useAuth } from '../context/Authentication.context';

export function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return <div>Loading Page ...</div>;
  }

  if (!auth.isLoading && !auth.user) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  return <AppLayout />;
}

export default RequireAuth;
