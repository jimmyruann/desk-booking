import './booking-page.module.css';
import { BookingItem } from '@desk-booking/ui';
import { Box, createStyles, Grid, Space, Tabs } from '@mantine/core';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useApi } from '../../shared/context/ApiClient';
import { useNotifications } from '@mantine/notifications';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import { BookingPageContext } from './context/BookingPageContext';
import TimeTab from './components/time-tab/time-tab';
import PeopleTab from './components/people-tab/people-tab';
import { useUserLocation } from '../../shared/context/UserLocation';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import RRule from 'rrule';
import MapBox from './components/map-box/map-box';
import InfoBox from './components/info-box/info-box';
import BookingControl from './components/booking-control/booking-control';
import { useQuery } from 'react-query';
import { isTimeOverlapped } from '../../shared/utils/time';
import { AxiosError } from 'axios';

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

export function BookingPage(props: BookingPageProps) {
  const { classes } = useStyles();

  const api = useApi();
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

      const dayjsInUserTimeZone = dayjs(date).tz(
        userLocation.location.timeZone
      );

      const { data } = await api.make.area.findOne({
        id,
        from: dayjsInUserTimeZone.startOf('day'),
        to: dayjsInUserTimeZone.endOf('day'),
      });

      return data;
    },
    {
      onSuccess: (areaData) => {
        if (areaData) {
          const dayjsInUserTimeZone = dayjs.tz(
            date,
            userLocation.location.timeZone
          );

          const allTimes = new RRule({
            freq: RRule.SECONDLY,
            interval: areaData.AreaType.interval / 1000,
            dtstart: dayjsInUserTimeZone
              .startOf('day')
              .add(areaData.Location.allowBookingFrom, 'minute')
              .utc(false)
              .toDate(),
            until: dayjsInUserTimeZone
              .startOf('day')
              .add(areaData.Location.allowBookingTill, 'minute')
              .utc(false)
              .toDate(),
          }).all(
            (date) =>
              date <
              dayjsInUserTimeZone
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

  return (
    <BookingPageContext.Provider
      value={{
        checked,
        setChecked,
        currentHtmlId,
        setCurrentHtmlId,
        date,
        setDate,
        availabilities,
      }}
    >
      <Grid grow>
        <Grid.Col md={12} lg={7} xl={7} data-cy="svgMapContainer">
          <MapBox />
        </Grid.Col>

        <Grid.Col md={12} lg={5} xl={5} gutter="md">
          <InfoBox />
          <Space h="md" />
          <Box className={classes.common}>
            <BookingControl />
            <Tabs grow>
              <Tabs.Tab
                label="Booking"
                icon={<HiOutlineCalendar size={18} id="bookingTab" />}
              >
                <TimeTab />
              </Tabs.Tab>
              <Tabs.Tab
                label="People"
                icon={<HiOutlineUserGroup size={18} id="peopleTab" />}
              >
                <PeopleTab data={getArea.data} />
              </Tabs.Tab>
            </Tabs>
          </Box>
        </Grid.Col>
      </Grid>
    </BookingPageContext.Provider>
  );
}

export default BookingPage;
