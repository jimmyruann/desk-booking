import { RouteObject } from 'react-router';
import RedirectAuth from '../../shared/components/RedirectAuth';
import LoginPage from './login-page/login-page';

export const authRoutes: RouteObject = {
  path: '/auth',
  element: <RedirectAuth />,
  children: [
    {
      path: 'login',
      element: <LoginPage />,
    },
  ],
};
