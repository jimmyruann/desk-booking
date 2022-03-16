// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NotFound } from '@desk-booking/ui';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RouteObject, useRoutes } from 'react-router';
import RequireAuth from '../shared/components/RequireAuth';
import { ApiClientProvider } from '../shared/context/ApiClient';
import { AuthenticationProvider } from '../shared/context/Authentication';
import { GlobalMessageProvider } from '../shared/context/GlobalMessage';
import { adminRoutes } from './admin/routes';
import { authRoutes } from './auth/routes';
import BookingPage from './booking-page/booking-page';
import FeedbackPage from './feedback-page/feedback-page';
import MyBookingPage from './my-booking-page/my-booking-page';

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
      adminRoutes,
    ],
  },
  authRoutes,
  {
    path: '*',
    element: <NotFound />,
  },
];

const myQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const routes = useRoutes(appRoutes);
  return (
    <QueryClientProvider client={myQueryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ApiClientProvider>
        <AuthenticationProvider>
          <GlobalMessageProvider>
            <MantineProvider withNormalizeCSS withGlobalStyles>
              <NotificationsProvider>{routes}</NotificationsProvider>
            </MantineProvider>
          </GlobalMessageProvider>
        </AuthenticationProvider>
      </ApiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
