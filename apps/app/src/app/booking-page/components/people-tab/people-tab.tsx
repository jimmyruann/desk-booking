import { createStyles, Table } from '@mantine/core';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import dayjs from 'dayjs';

import './people-tab.module.css';
import { useNotifications } from '@mantine/notifications';
import { useBookingPage } from '../../context/BookingPageContext';
import { useApi } from '../../../../shared/context/ApiClient';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { Loading } from '@desk-booking/ui';

/* eslint-disable-next-line */
export interface PeopleTabProps {
  // data: FindOneAreaWithBookingResponse;
}

const useStyles = createStyles((theme) => ({
  greenText: {
    color: theme.colors.green[8],
  },
  redText: {
    color: theme.colors.red[8],
  },
}));

export function PeopleTab(props: PeopleTabProps) {
  const { classes } = useStyles();
  const api = useApi();
  const bookingPage = useBookingPage();
  const notifications = useNotifications();
  const userLocation = useUserLocation();

  const { data, status } = useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      {
        id: bookingPage.currentHtmlId,
        date: bookingPage.currentHtmlId,
      },
    ] as const,
    async ({ queryKey }) => {
      const { date, id } = queryKey[1];
      if (!date || !id) return null;

      const dayjsInUserTimeZone = dayjs(date).tz(
        userLocation.location.timeZone
      );

      const { data } = await api.make.area.findOne({
        id,
        from: dayjsInUserTimeZone.startOf('day'),
        to: dayjsInUserTimeZone.endOf('day'),
      });

      return data;
    },
    {
      onError: (error: AxiosError) => {
        notifications.showNotification({
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <div>Something went wrong</div>;

  return (
    <Table id="peopleBookedTable">
      <thead>
        <tr>
          <th>Booked By</th>
          <th>Start</th>
          <th>End</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.Booking.map((unavailability, i) => {
            const start = dayjs(unavailability.startTime).tz(
              userLocation.location.timeZone
            );
            const end = dayjs(unavailability.endTime).tz(
              userLocation.location.timeZone
            );

            return (
              <tr key={i}>
                <td>{`${unavailability.User.firstName} ${unavailability.User.lastName}`}</td>
                <td>{start.format('hh:mm A')}</td>
                <td>{end.format('hh:mm A')}</td>
                <td
                  className={` ${
                    end > dayjs().tz(userLocation.location.timeZone)
                      ? classes.greenText
                      : classes.redText
                  }`}
                >
                  {start.fromNow()}
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

export default PeopleTab;
