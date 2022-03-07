import './booking-table.module.css';
import { FindAllBookingReturn } from '@desk-booking/data';
import { ActionIcon, Table } from '@mantine/core';
import { HiX } from 'react-icons/hi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/* eslint-disable-next-line */
export interface BookingTableProps {
  data: FindAllBookingReturn;
}

export function BookingTable({ data }: BookingTableProps) {
  return (
    <div className="tw-py-2">
      <Table highlightOnHover={true} striped={true}>
        <thead>
          <tr>
            <th>Location</th>
            <th>Entity</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>When</th>
            <th className="tw-flex tw-justify-center tw-items-center">
              Options
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((each) => {
            const startDayJs = dayjs(each.startTime);
            const endDayJs = dayjs(each.endTime);
            return (
              <tr key={each.id}>
                <td className="tw-capitalize">{each.Area.Location.name}</td>
                <td>{each.Area.htmlId}</td>
                <td>{startDayJs.format('ddd MMM DD YYYY')}</td>
                <td>{startDayJs.format('hh:mm A')}</td>
                <td>{endDayJs.format('hh:mm A')}</td>
                <td>
                  {endDayJs.diff(startDayJs, 'hours') >= 1
                    ? `${endDayJs.diff(startDayJs, 'hours')}h`
                    : `${endDayJs.diff(startDayJs, 'minutes')}m`}
                </td>
                <td
                  className={` ${
                    endDayJs.toDate() > new Date()
                      ? 'tw-text-green-700'
                      : 'tw-text-red-600'
                  }`}
                >
                  {startDayJs.fromNow()}
                </td>
                <td className="tw-flex tw-justify-center tw-items-center">
                  <ActionIcon color="red" variant="filled" title="Delete">
                    <HiX size={14} />
                  </ActionIcon>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default BookingTable;
