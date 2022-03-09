import './booking-page.module.css';
import {
  Loading,
  Node,
  Map,
  BookingItem,
  BookingTimeListControl,
  BookingTimeList,
  DigitalTime,
} from '@desk-booking/ui';
import { CreateBookingResponse } from '@desk-booking/data';
import {
  createStyles,
  Divider,
  Grid,
  Group,
  Space,
  Tabs,
  Text,
} from '@mantine/core';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useApi } from '../../shared/context/ApiClient';
import { generateAvailableTime } from '../../shared/utils/generateAvailableTime';
import { useNotifications } from '@mantine/notifications';
import { isTimeOverlapped, mergeTime } from '../../shared/utils/time';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import { environment } from '../../environments/environment';
import { BookingPageContext } from './context/BookingPageContext';
import TimeTab from './components/time-tab/time-tab';
import PeopleTab from './components/people-tab/people-tab';
import { useUserLocation } from '../../shared/context/UserLocation';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import RRule from 'rrule';

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

  const [date, setDate] = useState(new Date());
  const [checked, setChecked] = useState<boolean[]>([]);
  const [currentHtmlId, setCurrentHtmlId] = useState('');
  const [availabilities, setAvailabilities] = useState<BookingItem[]>([]);

  useEffect(() => {
    setDate(new Date());
    setChecked([]);
    setCurrentHtmlId('');
    setAvailabilities([]);
  }, [userLocation.location.name]);

  const getArea = useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      {
        id: currentHtmlId,
        date,
      },
    ] as const,
    async ({ queryKey }) => {
      const { date, id } = queryKey[1];
      if (!date || !id) return null;

      const dayjsCurrentTimeZone = dayjs(date).tz(
        userLocation.location.timeZone
      );

      const { data } = await api.make.area.findOne({
        id,
        from: dayjsCurrentTimeZone.startOf('day'),
        to: dayjsCurrentTimeZone.endOf('day'),
      });

      return data;
    },
    {
      onSuccess: (areaData) => {
        if (areaData) {
          const allTimes = new RRule({
            freq: RRule.SECONDLY,
            interval: areaData.AreaType.interval / 1000,
            dtstart: dayjs
              .tz(date, userLocation.location.timeZone)
              .startOf('day')
              .add(areaData.Location.allowBookingFrom, 'minute')
              .utc(false)
              .toDate(),
            until: dayjs
              .tz(date, userLocation.location.timeZone)
              .startOf('day')
              .add(areaData.Location.allowBookingTill, 'minute')
              .utc(false)
              .toDate(),
          }).all(
            (date) =>
              date <
              dayjs
                .tz(date, userLocation.location.timeZone)
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

          setAvailabilities(result);
          setChecked(new Array(result.length).fill(false));
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
    ['GET_FLOOR_PLAN', userLocation.location.name] as const,
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
      return api.client.post<CreateBookingResponse>('/bookings', data);
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
    const checkedTime = checked
      .map(
        (curr, i) =>
          curr && {
            startTime: availabilities[i].startTime,
            endTime: availabilities[i].endTime,
          }
      )
      .filter((curr) => !!curr);

    const bookings = mergeTime(checkedTime);

    console.log(JSON.stringify(checkedTime), JSON.stringify(bookings));

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
        checked,
        setChecked,
        currentHtmlId,
        setCurrentHtmlId,
      }}
    >
      <Grid grow>
        <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
          <div className={classes.common}>
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
              data-cy={`svgMap-${userLocation.location.name}`}
            />
          </div>
        </Grid.Col>

        <Grid.Col md={12} lg={5} xl={5}>
          <Group direction="column" className={classes.common}>
            <section>
              <Text data-cy="svgMapHeadingLocation">
                Location: <b>{userLocation.location.displayName}</b>
              </Text>
              <Text data-cy="svgMapHeadingHtmlId">
                Area: <b>{currentHtmlId || '-'}</b>
              </Text>
            </section>
            <section>
              <Text weight={500} size="md" color="orange">
                Note*
              </Text>
              <Text data-cy="currentLocationTimeZone">
                Timezone: <b>{userLocation.location.timeZone}</b>.
              </Text>
              <Text data-cy="currentLocationTime">
                Time:{' '}
                <b>
                  <DigitalTime timeZone={userLocation.location.timeZone} />
                </b>
              </Text>
            </section>
          </Group>
          <Space h="md" />
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
                <TimeTab
                  availabilities={availabilities}
                  timeZone={userLocation.location.timeZone}
                />
              </Tabs.Tab>
              <Tabs.Tab
                label="People"
                icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
              >
                <PeopleTab
                  data={getArea.data}
                  timeZone={userLocation.location.timeZone}
                />
              </Tabs.Tab>
            </Tabs>
          </div>
        </Grid.Col>
      </Grid>
    </BookingPageContext.Provider>
  );
}

export default BookingPage;
