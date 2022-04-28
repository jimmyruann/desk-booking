import {
  AreaAvailabilityEntity,
  AreaEntity,
  BookingResponse,
  CreateBookingDto,
} from '@desk-booking/data';
import { Alert, Grid, Overlay, Paper, Space } from '@mantine/core';
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
import Map from '../../shared/components/map/v2/map';
import { useMapLocation } from '../../shared/context/MapLocation.context';
import { mergeInterval } from '../../shared/utils/merge-interval';
import BookingControl from './components/booking-control/booking-control';
import TabContainer from './components/tabs/tab-container';

dayjs.extend(utc);
dayjs.extend(timezone);

const filterAreaBookable = (areas: AreaEntity[]) => {
  areas = areas.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, undefined, { numeric: true })
  );

  const allowed: AreaEntity[] = [];
  const notAllowed: AreaEntity[] = [];

  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];
    area.allowBooking ? allowed.push(area) : notAllowed.push(area);
  }

  return [allowed, notAllowed];
};

const getLocationAreas = async (locationId: string) => {
  const { data } = await axiosApiClient.get<AreaEntity[]>('/areas', {
    params: { locationId },
  });
  return data;
};

const createBooking = async (values: CreateBookingDto) => {
  const { data } = await axiosApiClient.post<BookingResponse[]>(
    '/bookings',
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
    ['areas', userLocation.currentLocation.locationId],
    () => getLocationAreas(userLocation.currentLocation.locationId),
    { staleTime: ms('5m') }
  );

  const createBookingMutation = useMutation(createBooking, {
    onSuccess: (data) => {
      notifications.showNotification({
        color: 'green',
        title: 'Booking Confirmed',
        message: 'You have booked.',
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
            startTime: curr.startTime.getTime(),
            endTime: curr.endTime.getTime(),
          }
      )
      .filter((curr) => !!curr);

    const mergedOverlapping = mergeInterval(checkedTime);

    createBookingMutation.mutate({
      htmlId,
      bookings: mergedOverlapping,
    });
  };

  if (areasQuery.status === 'loading') return <div>Loading ...</div>;
  if (areasQuery.status === 'error')
    return <div>Unable to get Location areas</div>;

  const [areaAllowBooking, areaNotAllowBooking] = filterAreaBookable(
    areasQuery.data
  );

  return (
    <>
      {userLocation.currentLocation.disabled && (
        <>
          <Alert color="yellow">
            <b>{userLocation.currentLocation.displayName}</b> is currently not
            taking any booking. Contact your Admin/HR.
          </Alert>
          <Space h="md" />
        </>
      )}

      <Paper
        shadow="xs"
        p="md"
        sx={() => ({
          position: 'relative',
        })}
      >
        <Grid grow>
          <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
            <Map
              locationId={userLocation.currentLocation.locationId}
              useHtmlId={() => [htmlId, setHtmlId]}
              disabledIds={areaNotAllowBooking.map((each) => each.htmlId)}
            />
          </Grid.Col>

          <Grid.Col md={12} lg={5} xl={5}>
            <BookingControl
              areasData={areaAllowBooking}
              useHtmlId={() => [htmlId, setHtmlId]}
              useDate={() => [date, setDate]}
              handleSubmit={handleSubmit}
            />
            <TabContainer
              date={date}
              htmlId={htmlId}
              location={userLocation.currentLocation}
              availabilityHook={[availability, availabilityHandler]}
            />
          </Grid.Col>
        </Grid>

        {userLocation.currentLocation.disabled && (
          <Overlay opacity={0.1} color="#000" zIndex={10} blur={1} />
        )}
      </Paper>
    </>
  );
}

export default BookingPage;
