import { BookingItem, BookingTimeList } from '@desk-booking/ui';
import { useBookingPage } from '../../context/BookingPageContext';
import './time-tab.module.css';

/* eslint-disable-next-line */
export interface TimeTabProps {
  availabilities: BookingItem[];
}

export function TimeTab({ availabilities }: TimeTabProps) {
  const bookingPage = useBookingPage();
  return (
    <BookingTimeList
      pagination={{ numberPerPage: 16 }}
      bookingItems={availabilities}
      style={{ display: 'relative' }}
      checkedItems={bookingPage.checked}
      setCheckedItems={bookingPage.setChecked}
    />
  );
}

export default TimeTab;
