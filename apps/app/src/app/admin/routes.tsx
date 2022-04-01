import { RouteObject } from 'react-router';
import RequireAdmin from '../../shared/guards/RequireAdmin.guard';
import AdminFeedbackPage from './admin-feedback-page/admin-feedback-page';
import AdminPage from './admin-page';
import AdminAreaSettingsPage from './admin-settings/admin-area-settings-page/admin-area-settings-page';
import AdminLocationSettingPage from './admin-settings/admin-location-setting-page/admin-location-setting-page';
import AdminSettingsPage from './admin-settings/admin-settings-page';

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <RequireAdmin />,
  children: [
    { index: true, element: <AdminPage /> },
    {
      path: 'settings',
      children: [
        { index: true, element: <AdminSettingsPage /> },
        { path: 'location', element: <AdminLocationSettingPage /> },
        { path: 'area', element: <AdminAreaSettingsPage /> },
      ],
    },
    {
      path: 'feedbacks',
      children: [
        { index: true, element: <AdminFeedbackPage /> },
        { path: ':id', element: <AdminFeedbackPage /> },
      ],
    },
  ],
};
