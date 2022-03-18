import { AreaAvailability, CreateBookingResponse } from '@desk-booking/data';
import { Box, createStyles, Grid, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import SvgLv16Area from '../../assets/sydney-lv16-areas.json';
import MapBox from '../../shared/components/map/map';
import { useApi } from '../../shared/context/ApiClient';
import { useUserLocation } from '../../shared/context/UserLocation';
import { mergeTime } from '../../shared/utils/time';
import './booking-page.module.css';
import BookingControl from './components/booking-control/booking-control';
import InfoBox from './components/info-box/info-box';
import TabContainer from './components/tab-container/tab-container';

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
      <Grid.Col
        md={12}
        lg={7}
        xl={7}
        data-cy="svgMapContainer"
        className={classes.common}
      >
        <MapBox
          mapUrl={userLocation.location.mapUrl}
          htmlIdHook={[htmlId, setHtmlId]}
          mapAreaChildren={SvgLv16Area.children}
        />
      </Grid.Col>

      <Grid.Col md={12} lg={5} xl={5} gutter="md" className={classes.common}>
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
      </Grid.Col>
    </Grid>
  );
}

export default BookingPage;
