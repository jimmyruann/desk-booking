import { FindAllBookingsResponse } from '@desk-booking/data';
import { Table } from '@mantine/core';
import MyBookingTableBody from './my-booking-table-body';

interface MyBookingTableProps {
  isLoading: boolean;
  isError: boolean;
  data: FindAllBookingsResponse;
  deleteMutation: (bookingId: number) => void;
}

export const MyBookingTable = ({
  isLoading,
  isError,
  data,
  deleteMutation,
}: MyBookingTableProps) => {
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  const handleDelete = (bookingId: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to cancel this booking?')) {
      deleteMutation(bookingId);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Area</th>
          <th>Start</th>
          <th>End</th>
          <th>Duration</th>
          <th>Options</th>
        </tr>
      </thead>
      <MyBookingTableBody data={data.data} handleDelete={handleDelete} />
    </Table>
  );
};

export default MyBookingTable;
