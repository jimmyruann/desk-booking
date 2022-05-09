import { Navigate, RouteObject } from 'react-router';
import NotFoundError from '../shared/components/errors/not-found-error';
import RedirectAuth from '../shared/guards/RedirectAuth.guard';
import RequireAdmin from '../shared/guards/RequireAdmin.guard';
import RequireAuth from '../shared/guards/RequireAuth.guard';
import { adminRoutes } from './admin/routes';
import { authRoutes } from './auth/routes';
import BookingPage from './booking-page/booking-page';
import FeedbackPage from './feedback-page/feedback-page';
import MyBookingPage from './my-booking-page/my-booking-page';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        index: true,
        element: <Navigate to="/bookings" replace />,
      },
      {
        path: 'bookings',
        children: [
          {
            index: true,
            element: <BookingPage />,
          },
          {
            path: 'me',
            element: <MyBookingPage />,
          },
        ],
      },
      {
        path: 'feedback',
        element: <FeedbackPage />,
      },
      {
        path: 'admin',
        element: <RequireAdmin />,
        children: adminRoutes.children,
      },
    ],
  },
  {
    path: '/auth',
    element: <RedirectAuth />,
    children: authRoutes.children,
  },
  {
    path: '*',
    element: <NotFoundError />,
  },
];
