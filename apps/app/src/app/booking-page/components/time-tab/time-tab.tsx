import { BookingTimeList, Loading } from '@desk-booking/ui';
import { useNotifications } from '@mantine/notifications';
import { useApi } from '../../../../shared/context/ApiClient';
import { useQuery } from 'react-query';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import { useBookingPage } from '../../context/BookingPageContext';
import './time-tab.module.css';
import dayjs from 'dayjs';
import RRule from 'rrule';
import { isTimeOverlapped } from '../../../..//shared/utils/time';
import { AxiosError } from 'axios';

/* eslint-disable-next-line */
export interface TimeTabProps {}

export function TimeTab(props: TimeTabProps) {
  const api = useApi();
  const notifications = useNotifications();
  const bookingPage = useBookingPage();
  const userLocation = useUserLocation();

  const { status } = useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      {
        id: bookingPage.currentHtmlId,
        date: bookingPage.date,
      },
    ] as const,
    async ({ queryKey }) => {
      const { date, id } = queryKey[1];
      if (!date || !id) return null;

      const dayjsInUserTimeZone = dayjs(date).tz(
        userLocation.location.timeZone
      );

      const { data } = await api.make.area.findOne({
        id,
        from: dayjsInUserTimeZone.startOf('day'),
        to: dayjsInUserTimeZone.endOf('day'),
      });

      return data;
    },
    {
      onSuccess: (areaData) => {
        if (areaData) {
          const dayjsInUserTimeZone = dayjs.tz(
            bookingPage.date,
            userLocation.location.timeZone
          );

          const allTimes = new RRule({
            freq: RRule.SECONDLY,
            interval: areaData.AreaType.interval / 1000,
            dtstart: dayjsInUserTimeZone
              .startOf('day')
              .add(areaData.Location.allowBookingFrom, 'minute')
              .utc(false)
              .toDate(),
            until: dayjsInUserTimeZone
              .startOf('day')
              .add(areaData.Location.allowBookingTill, 'minute')
              .utc(false)
              .toDate(),
          }).all(
            (date) =>
              date <
              dayjsInUserTimeZone
                .startOf('day')
                .add(areaData.Location.allowBookingTill, 'minute')
                .utc(false)
                .toDate()
          );

          const result = allTimes.map((curr, i) => {
            const startTime = curr;
            const endTime = dayjs(curr)
              .add(areaData.AreaType.interval, 'millisecond')
              .toDate();
            return {
              startTime,
              endTime,
              disabled: areaData.Booking
                ? areaData.Booking.some((curr) =>
                    isTimeOverlapped(
                      {
                        startTime,
                        endTime,
                      },
                      {
                        startTime: curr.startTime,
                        endTime: curr.endTime,
                      }
                    )
                  )
                : false,
            };
          });

          bookingPage.setAvailabilities(result);
          bookingPage.setChecked(new Array(result.length).fill(false));
        }
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <div>Something went wrong</div>;

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
