import { BookingResponse } from '@desk-booking/data';
import { Table } from '@mantine/core';
import AdminBookingViewTableBody from './admin-booking-view-table-body';

interface AdminBookingViewTableProps {
  status: 'idle' | 'error' | 'loading' | 'success';
  data: BookingResponse[];
}

export const AdminBookingViewTable = ({
  status,
  data,
}: AdminBookingViewTableProps) => {
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error...</div>;

  return (
    <Table>
      <thead>
        <tr>
          <th>User</th>
          <th>Location</th>
          <th>Area</th>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <AdminBookingViewTableBody data={data} />
    </Table>
  );
};

export default AdminBookingViewTable;
