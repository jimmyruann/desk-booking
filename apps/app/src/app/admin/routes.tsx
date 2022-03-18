import { RouteObject } from 'react-router';
import RequireAdmin from '../../shared/components/RequireAdmin';
import AdminHomePage from './admin-home-page/admin-home-page';
import AdminLocationSettingPage from './admin-location-setting-page/admin-location-setting-page';

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <RequireAdmin />,
  children: [
    { index: true, element: <AdminHomePage /> },
    {
      path: 'settings',
      children: [{ path: 'location', element: <AdminLocationSettingPage /> }],
    },
  ],
};
