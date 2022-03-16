import { AreaAvailability, CreateBookingResponse } from '@desk-booking/data';
import { Node } from '@desk-booking/ui';
import { Box, createStyles, Grid, Space, Tabs, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useState } from 'react';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { environment } from '../../environments/environment';
import { useApi } from '../../shared/context/ApiClient';
import { useUserLocation } from '../../shared/context/UserLocation';
import { mergeTime } from '../../shared/utils/time';
import './booking-page.module.css';
import BookingControl from './components/booking-control/booking-control';
import InfoBox from './components/info-box/info-box';
import MapBox from './components/map-box/map-box';
import PeopleTab from './components/people-tab/people-tab';
import TimeTab from './components/time-tab/time-tab';

dayjs.extend(utc);
dayjs.extend(timezone);

/* eslint-disable-next-line */
export interface BookingPageProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

function BookingPage(props: BookingPageProps) {
  const { classes } = useStyles();

  const api = useApi();
  const userLocation = useUserLocation();
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const [htmlId, setHtmlId] = useState('');
  const [availability, availabilityHandler] = useListState<
    AreaAvailability & { checked: boolean }
  >([]);
  const [date, setDate] = useState(new Date());

  const resetState = () => {
    setHtmlId('');
    availabilityHandler.setState([]);
    setDate(new Date());
  };

  const handleQueryError = (
    error: AxiosError,
    title?: ReactNode,
    message?: ReactNode
  ) => {
    notifications.showNotification({
      color: 'red',
      title: title || error.response.data.title || error.name,
      message: message || error.response.data.message || error.message,
    });
  };

  const mapQuery = useQuery(
    ['GET_FLOOR_PLAN', userLocation.location.mapUrl] as const,
    async ({ queryKey }) => {
      const { data } = await axios.get<Node>(
        `${environment.floorPlanUrl}/${queryKey[1]}`
      );
      return data;
    },
    {
      onSuccess: () => resetState(),
      onError: (error: AxiosError) =>
        handleQueryError(error, 'Unable to Loading Map'),
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const areaAvailabilityAreaQuery = useQuery(
    [
      'GET_AREA_AVAILABILITIES',
      {
        htmlId,
        date,
      },
    ] as const,
    async ({ queryKey }) => {
      const { date, htmlId } = queryKey[1];
      if (!date || !htmlId) return null;

      const dayjsInUserTimeZone = dayjs(date).tz(
        userLocation.location.timeZone
      );

      const { data } = await api.make.area.findAvailabilities({
        id: htmlId,
        date: dayjsInUserTimeZone,
      });

      return data;
    },
    {
      onSuccess: (areaData) => {
        const availabilities = areaData
          ? areaData.availabilities.map((each) => {
              return {
                ...each,
                checked: false,
              };
            })
          : [];
        availabilityHandler.setState(availabilities);
      },
      onError: (error: AxiosError) => handleQueryError(error),
      refetchOnMount: false,
    }
  );

  const createBookingMutation = useMutation(
    (data: {
      htmlId: string;
      bookings: { startTime: Date; endTime: Date }[];
    }) => {
      return api.client.post<CreateBookingResponse>('/bookings', data);
    },
    {
      onSuccess: ({ data }) => {
        notifications.showNotification({
          color: 'green',
          title: 'Booking Confirmed',
          message: (
            <Text>
              You have booked <b>{data.displayName}</b>.
            </Text>
          ),
        });
      },
      onError: (error: AxiosError) => handleQueryError(error),
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
    <Grid grow>
      <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
        <MapBox
          data={mapQuery.data}
          status={mapQuery.status}
          error={mapQuery.error}
          htmlIdHook={[htmlId, setHtmlId]}
        />
      </Grid.Col>

      <Grid.Col md={12} lg={5} xl={5} gutter="md">
        <InfoBox htmlId={htmlId} />
        <Space h="md" />
        <Box className={classes.common}>
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
          <Tabs grow>
            <Tabs.Tab
              label="Booking"
              icon={<HiOutlineCalendar size={18} id="bookingTab" />}
            >
              <TimeTab
                status={areaAvailabilityAreaQuery.status}
                error={areaAvailabilityAreaQuery.error}
                availabilityHook={[availability, availabilityHandler]}
              />
            </Tabs.Tab>
            <Tabs.Tab
              label="People"
              icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
            >
              <PeopleTab
                data={areaAvailabilityAreaQuery.data}
                status={areaAvailabilityAreaQuery.status}
                error={areaAvailabilityAreaQuery.error}
              />
            </Tabs.Tab>
          </Tabs>
        </Box>
      </Grid.Col>
    </Grid>
  );
}

export default BookingPage;
