import { BookingEntity, BookingWithAreaEntity } from '@desk-booking/data';
import { createStyles, Space, Text } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosApiClient } from '../../shared/api';
import { ServerError } from '../../shared/components/errors/server-error';
import Loading from '../../shared/components/loading/loading';
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

const getBookingWithAreaEntity = async (params: {
  startTime: Date;
  endTime: Date;
}) => {
  const { data } = await axiosApiClient.get<BookingWithAreaEntity[]>(
    '/bookings/user/withArea',
    { params }
  );

  return data;
};

const deleteBooking = async (id: number) => {
  const { data } = await axiosApiClient.delete<BookingEntity>(
    `/bookings/${id}`
  );
  return data;
};

export function MyBookingPage(props: MyBookingPageProps) {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf('day').toDate(),
    dayjs().endOf('week').toDate(),
  ]);

  const { classes } = useStyles();

  const myBookingsQuery = useQuery(
    'getBookingWithAreaEntity',
    () =>
      getBookingWithAreaEntity({
        startTime: dates[0],
        endTime: dates[1],
      }),
    {
      onError: (error: AxiosError) => {
        notifications.showNotification({
          title: 'Something went wrong',
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  const deleteBookingMutation = useMutation(deleteBooking, {
    onSuccess: (data) => {
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
  });

  const handleOnClickDelete = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to cancel this booking?')) {
      deleteBookingMutation.mutate(id);
    }
  };

  if (myBookingsQuery.status === 'loading') return <Loading fullscreen />;
  if (myBookingsQuery.status === 'error') return <ServerError />;

  return (
    <>
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
    </>
  );
}

export default MyBookingPage;
