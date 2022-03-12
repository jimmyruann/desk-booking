import { FindAllBookingResponse } from '@desk-booking/data';
import { BookingTable } from '@desk-booking/ui';
import { createStyles, Space, Text } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useApi } from '../../shared/context/ApiClient';
import './my-booking-page.module.css';

/* eslint-disable-next-line */
export interface MyBookingPageProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
  title: {
    fontWeight: 700,
    fontSize: 20,
  },
}));

export function MyBookingPage(props: MyBookingPageProps) {
  const api = useApi();
  const notifications = useNotifications();
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf('hour').toDate(),
    dayjs().endOf('week').toDate(),
  ]);

  const { classes } = useStyles();

  const { data, isLoading, isError } = useQuery(
    ['getMyBookings', { startTime: dates[0], endTime: dates[1] }] as const,
    async ({ queryKey }) => {
      const { startTime, endTime } = queryKey[1];
      if (!startTime || !endTime) return [];

      const { data } = await api.client.get<FindAllBookingResponse>(
        '/bookings',
        {
          params: { startTime, endTime },
        }
      );

      return data;
    },
    {
      onError: (error: AxiosError) => {
        notifications.showNotification({
          title: 'Something went wrong',
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  if (isError) return <div>Ops there was an error.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No availabilities founded, choose another one.</div>;

  return (
    <div className={classes.common}>
      <Text className={classes.title}>My Bookings</Text>
      <Space h="md" />
      <BookingTable data={data} />
    </div>
  );
}

export default MyBookingPage;
