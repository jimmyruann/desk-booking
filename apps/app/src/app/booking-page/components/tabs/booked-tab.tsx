import { AreaBookingsEntity } from '@desk-booking/data';
import { createStyles, ScrollArea, Table } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { Location } from '@prisma/client';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQuery } from 'react-query';
import { axiosApiClient } from '../../../../shared/api';
import Loading from '../../../../shared/components/loading/loading';
dayjs.extend(relativeTime);

/* eslint-disable-next-line */
interface BookedProps {
  location: Location;
  htmlId: string;
  date: Date;
}

const useStyles = createStyles((theme) => ({
  greenText: {
    color: theme.colors.green[8],
  },
  redText: {
    color: theme.colors.red[8],
  },
}));

const getAreaBookingsEntity = async (htmlId: string, date: Date) => {
  if (!htmlId || !date) return [];

  const { data } = await axiosApiClient.get<AreaBookingsEntity[]>(
    `/areas/${htmlId}/bookings`,
    {
      params: { date },
    }
  );

  return data;
};

export function BookedTab({ location, htmlId, date }: BookedProps) {
  const { classes } = useStyles();
  const notifications = useNotifications();

  const { data, status } = useQuery(
    ['GET_AREA_BOOKINGS', htmlId, date],
    () =>
      getAreaBookingsEntity(htmlId, dayjs(date).tz(location.timeZone).toDate()),
    {
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error')
    return <div>Something went wrong while loading People Data</div>;

  const items = data.map((unavailability) => {
    const start = dayjs(unavailability.startTime).tz(location.timeZone);
    const end = dayjs(unavailability.endTime).tz(location.timeZone);

    return (
      <tr key={unavailability.id}>
        <td>{`${unavailability.User.firstName} ${unavailability.User.lastName}`}</td>
        <td>{start.format('hh:mm A')}</td>
        <td>{end.format('hh:mm A')}</td>
        <td
          className={` ${
            end > dayjs().tz(location.timeZone)
              ? classes.greenText
              : classes.redText
          }`}
        >
          {start.fromNow()}
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea style={{ height: 350 }} offsetScrollbars>
      <Table id="peopleBookedTable">
        <thead>
          <tr>
            <th>Booked By</th>
            <th>Start</th>
            <th>End</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
    </ScrollArea>
  );
}

export default BookedTab;
