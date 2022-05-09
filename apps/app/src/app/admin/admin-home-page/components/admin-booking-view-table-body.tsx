import { BookingResponse } from '@desk-booking/data';
import dayjs from 'dayjs';

interface AdminBookingViewTableBodyProps {
  data: BookingResponse[];
}

export const AdminBookingViewTableBody = ({
  data,
}: AdminBookingViewTableBodyProps) => {
  return (
    <tbody>
      {data.map((each) => {
        return (
          <tr key={each.id}>
            <td>{`${each.User.firstName} ${each.User.lastName}`}</td>
            <td>{each.Area.Location.displayName}</td>
            <td>{each.Area.displayName}</td>
            <td>{dayjs(each.startTime).format('h:mm A, MMMM D, YYYY')}</td>
            <td>{dayjs(each.endTime).format('h:mm A, MMMM D, YYYY')}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default AdminBookingViewTableBody;
