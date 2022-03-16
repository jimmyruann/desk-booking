import { RouteObject } from 'react-router';
import AdminHomePage from './admin-home-page/admin-home-page';

export const adminRoutes: RouteObject = {
  path: 'admin',
  children: [{ index: true, element: <AdminHomePage /> }],
};
