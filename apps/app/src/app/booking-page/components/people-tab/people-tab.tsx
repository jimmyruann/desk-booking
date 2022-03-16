import { FindAreaAvailabilitiesResponse } from '@desk-booking/data';
import { createStyles, Table } from '@mantine/core';
import dayjs from 'dayjs';
import QueryStateHandler, {
  QueryHandlerProps,
} from '../../../../shared/components/query-state-handler/query-state-handler';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import './people-tab.module.css';

/* eslint-disable-next-line */
export interface PeopleTabProps extends QueryHandlerProps {
  data: FindAreaAvailabilitiesResponse;
}

const useStyles = createStyles((theme) => ({
  greenText: {
    color: theme.colors.green[8],
  },
  redText: {
    color: theme.colors.red[8],
  },
}));

export function PeopleTab({ data, status, error }: PeopleTabProps) {
  const { classes } = useStyles();
  const userLocation = useUserLocation();

  const items =
    data &&
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
    });

  return (
    <QueryStateHandler status={status} error={error}>
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
    </QueryStateHandler>
  );
}

export default PeopleTab;
