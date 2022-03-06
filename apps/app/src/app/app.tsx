// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { MyQueryClientProvider } from '../shared/context/MyQueryClient';
import { ApiClientProvider } from '../shared/context/ApiClient';
import { AuthenticationProvider } from '../shared/context/Authentication';
import { GlobalMessageProvider } from '../shared/context/GlobalMessage';
import { RouteObject, useRoutes } from 'react-router';
import { NotFound } from '@desk-booking/ui';
import LoginPage from './auth/login-page/login-page';
import RequireAuth from '../shared/components/RequireAuth';
import RedirectAuth from '../shared/components/RedirectAuth';
import BookingPage from './booking-page/booking-page';
import MyBookingPage from './my-booking-page/my-booking-page';
import FeedbackPage from './feedback-page/feedback-page';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        index: true,
        element: <BookingPage />,
      },
      {
        path: 'mybooking',
        element: <MyBookingPage />,
      },
      {
        path: 'feedback',
        element: <FeedbackPage />,
      },
      // ...adminRoutes,
    ],
  },
  {
    path: '/auth',
    element: <RedirectAuth />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export function App() {
  const routes = useRoutes(appRoutes);
  return (
    <MyQueryClientProvider>
      <ApiClientProvider>
        <AuthenticationProvider>
          <GlobalMessageProvider>
            <MantineProvider>
              <NotificationsProvider>{routes}</NotificationsProvider>
            </MantineProvider>
          </GlobalMessageProvider>
        </AuthenticationProvider>
      </ApiClientProvider>
    </MyQueryClientProvider>
  );
}

export default App;
