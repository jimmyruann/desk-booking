import {
  AreaAvailabilityEntity,
  AreaEntity,
  BookingEntity,
  CreateBookingDto,
} from '@desk-booking/data';
import { Box, Paper, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosApiClient } from '../../shared/api';
import Loading from '../../shared/components/loading/loading';
import MapLayout from '../../shared/components/map/map-layout';
import { useMapLocation } from '../../shared/context/MapLocation.context';
// import { useUserLocation } from '../../shared/context/UserLocation';
import { mergeTime } from '../../shared/utils/time';
import BookingControl from './components/booking-control/booking-control';
import InfoBox from './components/info-box/info-box';
import TabContainer from './components/tabs/tab-container';

dayjs.extend(utc);
dayjs.extend(timezone);

const getLocationAreas = async (locationId: string) => {
  const { data } = await axiosApiClient.get<AreaEntity[]>('/areas', {
    params: { locationId },
  });
  return data;
};

const createBooking = async (values: CreateBookingDto) => {
  const { data } = await axiosApiClient.post<BookingEntity[]>(
    '/bookings/user',
    values
  );
  return data;
};

function BookingPage() {
  const userLocation = useMapLocation();
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
    setDate(new Date());
    availabilityHandler.setState([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.currentLocation]);

  const { data: locationAreasData, status: locationAreasStatus } = useQuery(
    ['locationAreas', userLocation.currentLocation.locationId],
    () => getLocationAreas(userLocation.currentLocation.locationId)
  );

  const createBookingMutation = useMutation(createBooking, {
    onSuccess: (data) => {
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
      queryClient.invalidateQueries(['GET_AREA_BOOKINGS']);
    },
  });

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

  if (locationAreasStatus === 'loading') return <Loading />;
  if (locationAreasStatus === 'error')
    return <div>Unable to get Location areas</div>;

  return (
    <Paper shadow="xs" p="md">
      <MapLayout
        locationId={userLocation.currentLocation.locationId}
        mapContextProps={{
          currentId: htmlId,
          setCurrentId: setHtmlId,
          disabledIds: locationAreasData
            .filter((locationArea) => !locationArea.allowBooking)
            .map((locationArea) => locationArea.htmlId),
          unavailableIds: [],
        }}
      >
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
            location={userLocation.currentLocation}
            availabilityHook={[availability, availabilityHandler]}
          />
        </Box>
      </MapLayout>
    </Paper>
  );
}

export default BookingPage;
