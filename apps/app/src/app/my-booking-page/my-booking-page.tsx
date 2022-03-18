import { FindAllBookingResponse } from '@desk-booking/data';
import { createStyles, Space, Text } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import QueryStateHandler from '../../shared/components/query-state-handler/query-state-handler';
import { useApi } from '../../shared/context/ApiClient';
import './my-booking-page.module.css';
import MyBookingTable from './my-booking-table/my-booking-table';

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
  const queryClient = useQueryClient();

  const [dates, setDates] = useState<[Date | null, Date | null]>([
    dayjs().startOf('day').toDate(),
    dayjs().endOf('week').toDate(),
  ]);

  const { classes } = useStyles();

  const myBookingsQuery = useQuery(
    ['GET_MY_BOOKINGS', { startTime: dates[0], endTime: dates[1] }] as const,
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

  const deleteBookingMutation = useMutation(
    (data: { id: number }) => {
      return api.make.booking.deleteBooking(data);
    },
    {
      onSuccess: ({ data }) => {
        notifications.showNotification({
          color: 'green',
          title: 'Your booking was canceled',
          message: `Have a nice day.`,
        });

        queryClient.invalidateQueries(['GET_MY_BOOKINGS']);
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: 'Unable to cancel your booking.',
          message:
            error.response.data.message ||
            error.message ||
            'Something went wrong.',
        });
      },
    }
  );

  const handleOnClickDelete = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to cancel this booking?')) {
      deleteBookingMutation.mutate({ id });
    }
  };

  return (
    <QueryStateHandler
      status={myBookingsQuery.status}
      error={myBookingsQuery.error}
    >
      <div className={classes.common}>
        <DateRangePicker
          label="Find your Bookings"
          placeholder="Pick dates range"
          value={dates}
          onChange={setDates}
          closeCalendarOnChange={false}
        />
      </div>
      <Space h="sm" />
      <div className={classes.common}>
        <Text className={classes.title}>My Bookings</Text>
        <Space h="md" />
        {myBookingsQuery.data && (
          <MyBookingTable
            data={myBookingsQuery.data}
            handleDelete={handleOnClickDelete}
          />
        )}
      </div>
    </QueryStateHandler>
  );
}

export default MyBookingPage;
