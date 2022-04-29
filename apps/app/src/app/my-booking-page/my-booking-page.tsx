// import { BookingEntity, BookingWithAreaEntity } from '@desk-booking/data';
import {
  FindAllBookingsResponse,
  FindOneBookingResponse,
} from '@desk-booking/data';
import { Paper, Space } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosApiClient } from '../../shared/api';
import { useAuth } from '../../shared/context/Authentication.context';
import MyBookingTable from './my-booking-table/my-booking-table';

/* eslint-disable-next-line */
export interface MyBookingPageProps {}

const getMyBookings = async (params: {
  userId: number;
  startTime: Date;
  endTime: Date;
  take?: number;
  skip?: number;
}) => {
  const { data } = await axiosApiClient.get<FindAllBookingsResponse>(
    '/bookings',
    {
      params: {
        ...params,
        startTime: params.startTime.getTime(),
        endTime: params.endTime.getTime(),
      },
    }
  );
  return data;
};

const deleteMyBooking = async (bookingId: number) => {
  const { data } = await axiosApiClient.delete<FindOneBookingResponse>(
    `/bookings/${bookingId}`
  );
  return data;
};

export const MyBookingPage = (props: MyBookingPageProps) => {
  const auth = useAuth();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf('day').toDate(),
    dayjs().endOf('week').toDate(),
  ]);

  const getMyBookingsQuery = useQuery(
    ['myBookings', dates],
    () =>
      getMyBookings({
        userId: auth.user.id,
        startTime: dates[0],
        endTime: dates[1],
      }),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const deleteMyBookingMutation = useMutation(
    (bookingId: number) => deleteMyBooking(bookingId),
    {
      onSuccess: (data) => {
        notifications.showNotification({
          color: 'green',
          title: 'Your booking was canceled',
          message: `Have a nice day.`,
        });

        queryClient.invalidateQueries(['myBookings']);
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || 'Unable to cancel your booking.',
          message:
            error.response.data.message ||
            error.message ||
            'Something went wrong.',
        });
      },
    }
  );

  return (
    <div>
      <Paper shadow="xs" p="md">
        <DateRangePicker
          label="Find your Bookings"
          placeholder="Pick dates range"
          value={dates}
          onChange={setDates}
          closeCalendarOnChange={false}
        />
      </Paper>
      <Space h="md" />
      <Paper shadow="xs" p="md">
        <MyBookingTable
          isLoading={getMyBookingsQuery.isLoading}
          isError={getMyBookingsQuery.isError}
          data={getMyBookingsQuery.data}
          deleteMutation={deleteMyBookingMutation.mutate}
        />
      </Paper>
    </div>
  );
};

export default MyBookingPage;
