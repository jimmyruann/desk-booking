import { RouteObject } from 'react-router';
import NotFoundError from '../shared/components/errors/not-found-error';
import RequireAuth from '../shared/components/RequireAuth';
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
    element: <NotFoundError />,
  },
];
