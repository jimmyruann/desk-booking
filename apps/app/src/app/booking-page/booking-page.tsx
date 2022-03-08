import './booking-page.module.css';
import {
  Loading,
  Node,
  Map,
  BookingItem,
  BookingTimeListControl,
  BookingTimeList,
} from '@desk-booking/ui';
import {
  CreateBookingReturn,
  AreaFindOneWithBookingReturn,
} from '@desk-booking/data';
import { createStyles, Grid, Tabs, Text } from '@mantine/core';

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
import { useUserLocation } from '../../shared/context/UserLocation';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
  mapHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
}));

export function BookingPage(props: BookingPageProps) {
  const { classes } = useStyles();

  const api = useApi();
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const userLocation = useUserLocation();
  const currentLocation = userLocation.getLocation(userLocation.location);

  const [date, setDate] = useState(
    dayjs
      .tz(new Date(), currentLocation.timeZone)
      .startOf('day')
      .utc(false)
      .toDate()
  );
  const [checked, setChecked] = useState<boolean[]>([]);
  const [currentHtmlId, setCurrentHtmlId] = useState('');
  const [availabilities, setAvailabilities] = useState<BookingItem[]>([]);

  useEffect(() => {
    setChecked([]);
    setCurrentHtmlId('');
    setAvailabilities([]);
  }, [currentLocation.timeZone, userLocation.location]);

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
            from: dayjs
              .tz(date, currentLocation.timeZone)
              .startOf('day')
              .utc(false)
              .toDate(),
            to: dayjs
              .tz(date, currentLocation.timeZone)
              .endOf('day')
              .utc(false)
              .toDate(),
          },
        }
      );

      return data;
    },

    {
      onSuccess: (areaData) => {
        console.log(date);

        if (areaData) {
          const ava = generateAvailableTime({
            from: dayjs
              .tz(date, currentLocation.timeZone)
              .startOf('day')
              .add(8, 'hour')
              .utc(false)
              .toDate(),
            to: dayjs
              .tz(date, currentLocation.timeZone)
              .endOf('day')
              .subtract(4, 'hour')
              .utc(false)
              .toDate(),
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
        <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
          <div className={classes.common}>
            <div className={classes.mapHeading}>
              <Text transform="capitalize" data-cy="svgMapHeadingLocation">
                Location: <b>{userLocation.location}</b>
              </Text>
              <Text data-cy="svgMapHeadingHtmlId">
                Currently Selected: <b>{currentHtmlId || 'None'}</b>
              </Text>
            </div>
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
              data-cy={`svgMap-${userLocation.location}`}
            />
          </div>
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
              <Tabs.Tab
                label="Booking"
                icon={<HiOutlineCalendar size={18} id="bookingTab" />}
              >
                <BookingTimeList
                  pagination={{ numberPerPage: 16 }}
                  bookingItems={availabilities}
                  style={{ display: 'relative' }}
                  checkedItems={checked}
                  setCheckedItems={setChecked}
                />
              </Tabs.Tab>
              <Tabs.Tab
                label="People"
                icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
              >
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
