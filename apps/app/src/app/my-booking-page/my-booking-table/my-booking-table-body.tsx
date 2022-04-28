import { BookingResponse } from '@desk-booking/data';
import { ActionIcon } from '@mantine/core';
import dayjs from 'dayjs';
import { HiX } from 'react-icons/hi';

interface MyBookingTableBodyProps {
  data: BookingResponse[];
  handleDelete: (bookingId: number) => void;
}

export const MyBookingTableBody = ({
  data,
  handleDelete,
}: MyBookingTableBodyProps) => {
  return (
    <tbody>
      {data.map((bookingResponse) => {
        const startDayJs = dayjs.tz(
          bookingResponse.startTime,
          bookingResponse.Area.Location.timeZone
        );
        const endDayJs = dayjs(
          bookingResponse.endTime,
          bookingResponse.Area.Location.timeZone
        );
        const duration =
          endDayJs.diff(startDayJs, 'hours') >= 1
            ? `${endDayJs.diff(startDayJs, 'hours')}h`
            : `${endDayJs.diff(startDayJs, 'minutes')}m`;

        return (
          <tr key={bookingResponse.id}>
            <td>{bookingResponse.Area.Location.displayName}</td>
            <td>{bookingResponse.Area.displayName}</td>
            <td>{startDayJs.format('ddd, MMM DD YYYY hh:mm A')}</td>
            <td>{endDayJs.format('ddd, MMM DD YYYY hh:mm A')}</td>
            <td>{duration}</td>
            <td>
              <ActionIcon
                color="red"
                variant="filled"
                title="Delete"
                onClick={() => handleDelete(bookingResponse.id)}
              >
                <HiX size={14} />
              </ActionIcon>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default MyBookingTableBody;
