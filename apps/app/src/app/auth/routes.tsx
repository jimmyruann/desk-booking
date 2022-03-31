import { RouteObject } from 'react-router';
import RedirectAuth from '../../shared/guards/RedirectAuth.guard';
import LoginPage from './login-page/login-page';
import SignUpPage from './signup-page/signup-page';

export const authRoutes: RouteObject = {
  path: '/auth',
  element: <RedirectAuth />,
  children: [
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignUpPage />,
    },
  ],
};
