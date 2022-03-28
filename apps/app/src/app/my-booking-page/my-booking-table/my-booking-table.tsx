import { BookingWithAreaEntity } from '@desk-booking/data';
import { ActionIcon, Table } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { HiX } from 'react-icons/hi';
dayjs.extend(relativeTime);

/* eslint-disable-next-line */
export interface MyBookingTableProps {
  data: BookingWithAreaEntity[];
  handleDelete: (id: number) => void;
}

export function MyBookingTable({ data, handleDelete }: MyBookingTableProps) {
  const items = data.map((each) => {
    const startDayJs = dayjs.tz(each.startTime, each.Area.Location.timeZone);
    const endDayJs = dayjs(each.endTime, each.Area.Location.timeZone);
    return (
      <tr key={each.id}>
        <td className="tw-capitalize">{each.Area.Location.displayName}</td>
        <td>{each.Area.displayName || each.Area.htmlId}</td>
        <td>{startDayJs.format('ddd, MMM DD YYYY')}</td>
        <td>{startDayJs.format('hh:mm A')}</td>
        <td>{endDayJs.format('hh:mm A')}</td>
        <td>
          {endDayJs.diff(startDayJs, 'hours') >= 1
            ? `${endDayJs.diff(startDayJs, 'hours')}h`
            : `${endDayJs.diff(startDayJs, 'minutes')}m`}
        </td>
        <td className="tw-flex tw-justify-center tw-items-center">
          <ActionIcon
            color="red"
            variant="filled"
            title="Delete"
            onClick={() => handleDelete(each.id)}
          >
            <HiX size={14} />
          </ActionIcon>
        </td>
      </tr>
    );
  });

  return (
    <Table highlightOnHover={true} striped={true}>
      <thead>
        <tr>
          <th>Location</th>
          <th>Area</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Duration</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>{items}</tbody>
    </Table>
  );
}

export default MyBookingTable;
