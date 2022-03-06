import './booking-page.module.css';
import {
  BookingTimeList,
  BookingTimeListControl,
  Loading,
  Node,
  Map,
} from '@desk-booking/ui';
import {
  CreateBookingReturn,
  FindOneWithBookingReturn,
} from '@desk-booking/data';
import { Container, createStyles, Grid } from '@mantine/core';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useApi } from '../../shared/context/ApiClient';
import { generateAvailableTime } from '../../shared/utils/generateAvailableTime';
import { useNotifications } from '@mantine/notifications';
import { mergeTime } from '../../shared/utils/time';

/* eslint-disable-next-line */
export interface BookingPageProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
    height: '100%',
  },
  bookingBox: {},
}));

export function BookingPage(props: BookingPageProps) {
  const api = useApi();
  const { classes } = useStyles();
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const [currentlySelectedData, setCurrentlySelectedData] = useState(
    dayjs().startOf('day').toDate()
  );
  const [currentlySelectedNodeID, setCurrentlySelectedNodeID] = useState('');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  const createBookingMutation = useMutation(
    (data: {
      htmlId: string;
      bookings: { startTime: Date; endTime: Date }[];
    }) => {
      return api.client.post<CreateBookingReturn>('/bookings', data);
    },
    {
      onSuccess: ({ data }) => {
        notifications.showNotification({
          title: 'Booking Confirmed',
          message: `You have booked ${data.htmlId}.`,
        });
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || 'Something went wrong',
          message: error.response.data.message || error.message,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['GET_AREA_BOOKING_DATA']);
      },
    }
  );

  const getFloorPlanMap = useQuery(
    ['GET_FLOOR_PLAN', 'singapore'] as const,
    async ({ queryKey }) => {
      const { data } = await axios.get<Node>(
        `https://jimmy-floorplan.s3.ap-southeast-2.amazonaws.com/floorplan/${queryKey[1]}.json`
      );
      return data;
    },
    {
      onError: (error: AxiosError) => {
        notifications.showNotification({
          title: 'Unable to load map',
          message: (
            <div>
              We were unable to process your booking. Try again later.
              <br />
              Error: {error.message}
            </div>
          ),
        });
      },
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const getAvailabilityForArea = useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      { currentlySelectedNodeID, currentlySelectedData },
    ] as const,
    async ({ queryKey }) => {
      if (
        !queryKey[1].currentlySelectedNodeID ||
        !queryKey[1].currentlySelectedData
      )
        return [];

      // Fetching
      const { data } = await api.client.get<FindOneWithBookingReturn>(
        `/areas/${queryKey[1].currentlySelectedNodeID}/bookings`,
        {
          params: {
            from: queryKey[1].currentlySelectedData,
            to: dayjs(queryKey[1].currentlySelectedData).endOf('day').toDate(),
          },
        }
      );

      const generatedTimes = generateAvailableTime({
        from: dayjs(queryKey[1].currentlySelectedData)
          .startOf('day')
          .add(8, 'hour')
          .toDate(),
        to: dayjs(queryKey[1].currentlySelectedData)
          .endOf('day')
          .subtract(4, 'hour')
          .toDate(),
        intervalInMs: data.AreaType.interval,
        excludes: data.Booking,
        noPastTime: true,
      });

      return generatedTimes;
    },
    {
      onSuccess: (data) => {
        setCheckedItems(new Array(data.length).fill(false));
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  const handleConfirmAndBook = () => {
    let bookings: { startTime: Date; endTime }[] = [];

    for (let i = 0; i < checkedItems.length; i++) {
      if (checkedItems[i]) {
        bookings.push({
          startTime: getAvailabilityForArea.data[i].startTime,
          endTime: getAvailabilityForArea.data[i].endTime,
        });
      }
    }
    bookings = mergeTime(bookings);

    createBookingMutation.mutate({
      htmlId: currentlySelectedNodeID,
      bookings,
    });
  };

  if (getFloorPlanMap.isLoading) return <Loading />;
  if (getFloorPlanMap.isError) return <div>Something went wrong</div>;

  return (
    <Container fluid>
      <Grid grow gutter="sm">
        <Grid.Col span={7}>
          <Map
            mapData={getFloorPlanMap.data}
            viewBox={
              getFloorPlanMap.data.attributes['viewBox'] &&
              getFloorPlanMap.data.attributes['viewBox']
                .split(' ')
                .map((each) => parseInt(each) || 0)
            }
            currentHtmlId={currentlySelectedNodeID}
            setCurrentHtmlId={setCurrentlySelectedNodeID}
            className={classes.common}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <div className={classes.common}>
            <BookingTimeListControl
              dateUseState={[currentlySelectedData, setCurrentlySelectedData]}
              handleOnSubmit={handleConfirmAndBook}
              disabled={
                createBookingMutation.isLoading ||
                checkedItems.every((each) => !each)
              }
            />
            <br />
            {getAvailabilityForArea.data &&
              !!getAvailabilityForArea.data.length && (
                <BookingTimeList
                  pagination={{ numberPerPage: 16 }}
                  bookingItems={getAvailabilityForArea.data}
                  style={{ display: 'relative' }}
                  checkedItems={checkedItems}
                  setCheckedItems={setCheckedItems}
                />
              )}
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default BookingPage;
