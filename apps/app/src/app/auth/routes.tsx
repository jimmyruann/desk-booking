import { RouteObject } from 'react-router';
import LoginPage from './login-page/login-page';
import SignUpPage from './signup-page/signup-page';

export const authRoutes: RouteObject = {
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
