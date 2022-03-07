import './booking-page.module.css';
import {
  Loading,
  Node,
  Map,
  BookingItem,
  BookingTimeListControl,
} from '@desk-booking/ui';
import {
  CreateBookingReturn,
  AreaFindOneWithBookingReturn,
} from '@desk-booking/data';
import { createStyles, Grid, Tabs } from '@mantine/core';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useApi } from '../../shared/context/ApiClient';
import { generateAvailableTime } from '../../shared/utils/generateAvailableTime';
import { useNotifications } from '@mantine/notifications';
import { mergeTime } from '../../shared/utils/time';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import { environment } from '../../environments/environment';
import { BookingPageContext } from './context/BookingPageContext';
import TimeTab from './components/time-tab/time-tab';
import PeopleTab from './components/people-tab/people-tab';
import { useUserLocation } from '@app/src/shared/context/UserLocation';

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

export function BookingPage(props: BookingPageProps) {
  const { classes } = useStyles();

  const api = useApi();
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const userLocation = useUserLocation();

  const [date, setDate] = useState(dayjs().startOf('day').toDate());
  const [checked, setChecked] = useState<boolean[]>([]);
  const [currentHtmlId, setCurrentHtmlId] = useState('');
  const [availabilities, setAvailabilities] = useState<BookingItem[]>([]);

  useEffect(() => {
    setChecked([]);
    setCurrentHtmlId('');
    setAvailabilities([]);
  }, [userLocation.location]);

  const getArea = useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      {
        htmlId: currentHtmlId,
        date,
      },
    ] as const,
    async ({ queryKey }) => {
      const { date, htmlId } = queryKey[1];
      if (!date || !htmlId) return null;

      // Fetching
      const { data } = await api.client.get<AreaFindOneWithBookingReturn>(
        `/areas/${htmlId}/bookings`,
        {
          params: {
            from: date,
            to: dayjs(date).endOf('day').toDate(),
          },
        }
      );

      return data;
    },

    {
      onSuccess: (areaData) => {
        if (areaData) {
          const ava = generateAvailableTime({
            from: dayjs(date).startOf('day').add(8, 'hour').toDate(),
            to: dayjs(date).endOf('day').subtract(4, 'hour').toDate(),
            intervalInMs: areaData.AreaType.interval,
            excludes: areaData.Booking,
            noPastTime: true,
          });
          setAvailabilities(ava);
          setChecked(new Array(ava.length).fill(false));
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

  const getFloorPlanMap = useQuery(
    ['GET_FLOOR_PLAN', userLocation.location] as const,
    async ({ queryKey }) => {
      const { data } = await axios.get<Node>(
        `${environment.floorPlanUrl}/${queryKey[1]}.json`
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

  const handleConfirmAndBook = () => {
    const bookings = mergeTime(
      checked
        .map((curr, i) => {
          return (
            curr && {
              startTime: availabilities[i].startTime,
              endTime: availabilities[i].endTime,
            }
          );
        })
        .filter((curr) => !!curr)
    );

    createBookingMutation.mutate({
      htmlId: currentHtmlId,
      bookings,
    });
  };

  if (getFloorPlanMap.isLoading) return <Loading />;
  if (getFloorPlanMap.isError) return <div>Something went wrong</div>;

  return (
    <BookingPageContext.Provider
      value={{
        date,
        setDate,
        checked,
        setChecked,
        currentHtmlId,
        setCurrentHtmlId,
      }}
    >
      <Grid grow>
        <Grid.Col md={12} lg={7} xl={7}>
          <Map
            mapData={getFloorPlanMap.data}
            viewBox={
              getFloorPlanMap.data.attributes['viewBox'] &&
              getFloorPlanMap.data.attributes['viewBox']
                .split(' ')
                .map((each) => parseInt(each) || 0)
            }
            currentHtmlId={currentHtmlId}
            setCurrentHtmlId={setCurrentHtmlId}
            className={classes.common}
          />
        </Grid.Col>
        <Grid.Col md={12} lg={5} xl={5}>
          <div className={classes.common}>
            <BookingTimeListControl
              date={date}
              setDate={setDate}
              handleOnSubmit={handleConfirmAndBook}
              disabled={
                createBookingMutation.isLoading ||
                checked.every((each) => !each)
              }
            />
            <Tabs grow>
              <Tabs.Tab label="Booking" icon={<HiOutlineCalendar size={18} />}>
                <TimeTab availabilities={availabilities} />
              </Tabs.Tab>
              <Tabs.Tab label="People" icon={<HiOutlineUserGroup size={18} />}>
                <PeopleTab data={getArea.data} />
              </Tabs.Tab>
            </Tabs>
          </div>
        </Grid.Col>
      </Grid>
    </BookingPageContext.Provider>
  );
}

export default BookingPage;
