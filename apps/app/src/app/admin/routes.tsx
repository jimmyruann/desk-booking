import { RouteObject } from 'react-router';
import AdminFeedbackPage from './admin-feedback-page/admin-feedback-page';
import AdminHomePage from './admin-home-page/admin-home-page';
import AdminAreaSettingsPage from './admin-settings-page/admin-area-settings-page/admin-area-settings-page';
import AdminLocationSettingPage from './admin-settings-page/admin-location-setting-page/admin-location-setting-page';
import AdminSettingsPage from './admin-settings-page/admin-settings-page';

export const adminRoutes: RouteObject = {
  children: [
    { index: true, element: <AdminHomePage /> },
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
