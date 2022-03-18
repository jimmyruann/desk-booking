import { FindAreaAvailabilitiesResponse } from '@desk-booking/data';
import { createStyles, Table } from '@mantine/core';
import { Location } from '@prisma/client';
import dayjs from 'dayjs';
import './people-tab.module.css';

/* eslint-disable-next-line */
export interface PeopleTabProps {
  data: FindAreaAvailabilitiesResponse;
  location: Location;
}

const useStyles = createStyles((theme) => ({
  greenText: {
    color: theme.colors.green[8],
  },
  redText: {
    color: theme.colors.red[8],
  },
}));

export function PeopleTab({ data, location }: PeopleTabProps) {
  const { classes } = useStyles();

  const items =
    data &&
    data.Booking.map((unavailability, i) => {
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
