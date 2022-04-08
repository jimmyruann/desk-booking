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
import ms from 'ms';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosApiClient } from '../../shared/api';
import Loading from '../../shared/components/loading/loading';
import MapLayout from '../../shared/components/map/map-layout';
import { useMapLocation } from '../../shared/context/MapLocation.context';
// import { useUserLocation } from '../../shared/context/UserLocation';
import { mergeTime } from '../../shared/utils/time';
import BookingControl from './components/booking-control/booking-control';
import TabContainer from './components/tabs/tab-container';

dayjs.extend(utc);
dayjs.extend(timezone);

const filterAreaBookingStatus = (areas: AreaEntity[]) => {
  areas = areas.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, undefined, { numeric: true })
  );

  const allowed: AreaEntity[] = [];
  const notAllowed: AreaEntity[] = [];

  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];
    area.allowBooking ? allowed.push(area) : notAllowed.push(area);
  }

  return {
    allowed,
    notAllowed,
  };
};

const getLocationAreas = async (locationId: string) => {
  const { data } = await axiosApiClient.get<AreaEntity[]>('/areas', {
    params: { locationId },
  });
  return filterAreaBookingStatus(data);
};

const createBooking = async (values: CreateBookingDto) => {
  const { data } = await axiosApiClient.post<BookingEntity[]>(
    '/bookings/user',
    values
  );
  return data;
};

const initialStates = {
  date: new Date(),
  htmlId: '',
  availability: [],
};

function BookingPage() {
  const userLocation = useMapLocation();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(initialStates.date);
  const [htmlId, setHtmlId] = useState(initialStates.htmlId);
  const [availability, availabilityHandler] = useListState<
    AreaAvailabilityEntity & { checked: boolean }
  >(initialStates.availability);

  // Reset state when location changes
  useEffect(() => {
    setDate(initialStates.date);
    setHtmlId(initialStates.htmlId);
    availabilityHandler.setState(initialStates.availability);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.currentLocation]);

  const areasQuery = useQuery(
    ['locationAreas', userLocation.currentLocation.locationId],
    () => getLocationAreas(userLocation.currentLocation.locationId),
    { staleTime: ms('5m') }
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

  const handleSubmit = () => {
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

  if (areasQuery.status === 'loading') return <Loading />;
  if (areasQuery.status === 'error')
    return <div>Unable to get Location areas</div>;

  return (
    <Paper shadow="xs" p="md">
      <MapLayout
        locationId={userLocation.currentLocation.locationId}
        mapContextProps={{
          currentId: htmlId,
          setCurrentId: setHtmlId,
          disabledIds: areasQuery.data.notAllowed.map((area) => area.htmlId),
          unavailableIds: [],
        }}
      >
        <Box>
          <BookingControl
            areasData={areasQuery.data}
            useHtmlId={() => [htmlId, setHtmlId]}
            useDate={() => [date, setDate]}
            handleSubmit={handleSubmit}
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
