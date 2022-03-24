import { AreaAvailabilityEntity, BookingEntity } from '@desk-booking/data';
import { Box, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import MapLayout from '../../shared/components/map/map-layout';
import { useApi } from '../../shared/context/ApiClient';
import { useUserLocation } from '../../shared/context/UserLocation';
import { mergeTime } from '../../shared/utils/time';
import BookingControl from './components/booking-control/booking-control';
import InfoBox from './components/info-box/info-box';
import TabContainer from './components/tab-container/tab-container';
import { TestMapContext } from './test-map-context';

dayjs.extend(utc);
dayjs.extend(timezone);

/* eslint-disable-next-line */
export interface BookingPageProps {}

function BookingPage(props: BookingPageProps) {
  const api = useApi();
  const userLocation = useUserLocation();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date());
  const [htmlId, setHtmlId] = useState('');
  const [availability, availabilityHandler] = useListState<
    AreaAvailabilityEntity & { checked: boolean }
  >([]);

  useEffect(() => {
    // reset when location changes
    setHtmlId('');
    availabilityHandler.setState([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.location]);

  // const getMapAreas = useQuery(['areas', userLocation.location], async () => {
  //   const { data } = await api.client.get<AreaEntity[]>('/areas', {
  //     params: {
  //       locationId: userLocation.location.locationId,
  //     },
  //   });
  //   return data;
  // });

  // if (getMapAreas.status === 'loading') return <Loading />;
  // if (getMapAreas.status === 'error')
  //   return <div>Something went wrong while loading Map Area data.</div>;

  const createBookingMutation = useMutation(
    (data: {
      htmlId: string;
      bookings: { startTime: Date; endTime: Date }[];
    }) => {
      return api.client.post<BookingEntity[]>('/bookings/user', data);
    },
    {
      onSuccess: ({ data }) => {
        notifications.showNotification({
          color: 'green',
          title: 'Booking Confirmed',
          message: <Text>You have booked.</Text>,
        });
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['GET_AREA_AVAILABILITIES']);
      },
    }
  );

  const handleMakeBooking = () => {
    const checkedTime = availability
      .map(
        (curr) =>
          curr.checked && {
            startTime: curr.startTime,
            endTime: curr.endTime,
          }
      )
      .filter((curr) => !!curr);

    createBookingMutation.mutate({
      htmlId,
      bookings: mergeTime(checkedTime),
    });
  };

  return (
    <TestMapContext.Provider
      value={{
        currentId: htmlId,
        setCurrentId: setHtmlId,
        disabledIds: [],
        unavailableIds: [],
      }}
    >
      <MapLayout locationId={userLocation.location.locationId}>
        <InfoBox htmlId={htmlId} />
        <br />
        <Box>
          <BookingControl
            dateHook={[date, setDate]}
            handleSubmit={handleMakeBooking}
            disableButton={
              !!(
                createBookingMutation.isLoading ||
                availability.every((value) => !value.checked)
              )
            }
          />
          <TabContainer
            date={date}
            htmlId={htmlId}
            location={userLocation.location}
            availabilityHook={[availability, availabilityHandler]}
          />
        </Box>
      </MapLayout>
    </TestMapContext.Provider>
  );
}

export default BookingPage;
