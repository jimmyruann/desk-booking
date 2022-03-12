import './booking-page.module.css';
import { Box, createStyles, Grid, Space, Tabs } from '@mantine/core';

import { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';

import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';
import {
  useBookingPage,
  withBookingPageProvider,
} from './context/BookingPageContext';
import TimeTab from './components/time-tab/time-tab';
import PeopleTab from './components/people-tab/people-tab';
import { useUserLocation } from '../../shared/context/UserLocation';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import MapBox from './components/map-box/map-box';
import InfoBox from './components/info-box/info-box';
import BookingControl from './components/booking-control/booking-control';

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

  return (
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
              <PeopleTab />
            </Tabs.Tab>
          </Tabs>
        </Box>
      </Grid.Col>
    </Grid>
  );
}

export default withBookingPageProvider(BookingPage);
