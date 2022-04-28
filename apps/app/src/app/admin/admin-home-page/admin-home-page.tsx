import { FindAllBookingsResponse } from '@desk-booking/data';
import { Group } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { axiosApiClient } from '../../../shared/api';
import { useMapLocation } from '../../../shared/context/MapLocation.context';
import AdminPageLayout from '../components/admin-page-layout';
import AdminBookingViewTable from './components/admin-booking-view-table';

const getMyBookings = async (params: {
  startTime: Date;
  endTime: Date;
  locationId: string;
  take?: number;
  skip?: number;
}) => {
  if (!params.startTime || !params.endTime) return { count: 0, data: [] };

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

export const AdminHomePage = () => {
  const userLocation = useMapLocation();
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf('week').toDate(),
    dayjs().endOf('week').toDate(),
  ]);

  const getBookingsQuery = useQuery(
    ['admin_getBookings', userLocation.currentLocation.locationId, dates],
    () =>
      getMyBookings({
        startTime: dates[0],
        endTime: dates[1],
        locationId: userLocation.currentLocation.locationId,
      })
  );

  return (
    <AdminPageLayout>
      <Group direction="column" grow>
        <DateRangePicker
          label="Booking Dates"
          placeholder="Pick dates range"
          value={dates}
          onChange={setDates}
          closeCalendarOnChange={false}
        />

        <AdminBookingViewTable
          status={getBookingsQuery.status}
          data={getBookingsQuery.data}
        />
      </Group>
    </AdminPageLayout>
  );
};

export default AdminHomePage;
