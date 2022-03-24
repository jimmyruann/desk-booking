import { createStyles, Table } from '@mantine/core';
import { Location } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQuery } from 'react-query';
import Loading from '../../../../shared/components/loading/loading';
import { useApi } from '../../../../shared/context/ApiClient';
dayjs.extend(relativeTime);

/* eslint-disable-next-line */
export interface PeopleTabProps {
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

export function PeopleTab({ location, htmlId, date }: PeopleTabProps) {
  const { classes } = useStyles();
  const api = useApi();

  const { data, status } = useQuery(
    ['GET_BOOKED_DATA', { htmlId, date }] as const,
    async ({ queryKey }) => {
      const { date, htmlId } = queryKey[1];
      if (!date || !htmlId) return [];

      const { data } = await api.client.get(`/areas/${htmlId}/bookings`, {
        params: {
          date: dayjs(date).tz(location.timeZone).toDate(),
        },
      });

      return data;
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error')
    return <div>Something went wrong while loading People Data</div>;

  const items = data.map((unavailability, i) => {
    const start = dayjs(unavailability.startTime).tz(location.timeZone);
    const end = dayjs(unavailability.endTime).tz(location.timeZone);

    return (
      <tr key={i}>
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
  );
}

export default PeopleTab;
