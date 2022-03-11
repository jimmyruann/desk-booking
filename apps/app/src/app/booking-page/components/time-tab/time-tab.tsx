import { BookingTimeList } from '@desk-booking/ui';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import { useBookingPage } from '../../context/BookingPageContext';
import './time-tab.module.css';

/* eslint-disable-next-line */
export interface TimeTabProps {}

export function TimeTab(props: TimeTabProps) {
  const bookingPage = useBookingPage();
  const userLocation = useUserLocation();
  return (
    <BookingTimeList
      pagination={{ numberPerPage: 16 }}
      bookingItems={bookingPage.availabilities}
      timeZone={userLocation.location.timeZone}
      style={{ display: 'relative' }}
      checkedItems={bookingPage.checked}
      setCheckedItems={bookingPage.setChecked}
    />
  );
}

export default TimeTab;
