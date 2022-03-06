import './booking-page.module.css';
import {
  BookingTimeList,
  BookingTimeListControl,
  Loading,
  Node,
  Map,
  BookingItem,
} from '@desk-booking/ui';
import {
  CreateBookingReturn,
  FindOneWithBookingReturn,
} from '@desk-booking/data';
import {
  Text,
  createStyles,
  Divider,
  Grid,
  Tabs,
  Timeline,
  Table,
} from '@mantine/core';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useApi } from '../../shared/context/ApiClient';
import { generateAvailableTime } from '../../shared/utils/generateAvailableTime';
import { useNotifications } from '@mantine/notifications';
import { mergeTime } from '../../shared/utils/time';
import { HiOutlineCalendar, HiOutlineUserGroup } from 'react-icons/hi';

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
  divider: {
    marginBlock: theme.spacing.sm,
  },
  greenText: {
    color: theme.colors.green[8],
  },
  redText: {
    color: theme.colors.red[8],
  },
}));

export function BookingPage(props: BookingPageProps) {
  const api = useApi();
  const { classes } = useStyles();
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const [currentlySelectedData, setCurrentlySelectedData] = useState(
    dayjs().startOf('day').toDate()
  );
  const [unavailabilities, setUnavailabilities] = useState<
    FindOneWithBookingReturn['Booking']
  >([]);
  const [availabilities, setAvailabilities] = useState<BookingItem[]>([]);
  const [currentHtmlId, setCurrentHtmlId] = useState('');
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

  useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      { htmlId: currentHtmlId, date: currentlySelectedData },
    ] as const,
    async ({ queryKey }) => {
      const { date, htmlId } = queryKey[1];
      if (!date || !htmlId) return null;

      // Fetching
      const { data } = await api.client.get<FindOneWithBookingReturn>(
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
      onSuccess: (data) => {
        if (data) {
          const generatedAvailabilities = generateAvailableTime({
            from: dayjs(currentlySelectedData)
              .startOf('day')
              .add(8, 'hour')
              .toDate(),
            to: dayjs(currentlySelectedData)
              .endOf('day')
              .subtract(4, 'hour')
              .toDate(),
            intervalInMs: data.AreaType.interval,
            excludes: data.Booking,
            noPastTime: true,
          });
          setAvailabilities(generatedAvailabilities);
          setCheckedItems(
            new Array(generatedAvailabilities.length).fill(false)
          );
          setUnavailabilities(mergeTime(data.Booking));
        }
      },
      onError: (error: AxiosError) => {
        setAvailabilities([]);
        setCheckedItems([]);
        setUnavailabilities([]);
        notifications.showNotification({
          title: error.response.data.title || error.name,
          message: error.response.data.message || error.message,
        });
      },
    }
  );

  const handleConfirmAndBook = () => {
    const bookings = mergeTime(
      checkedItems
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
        <Tabs grow className={classes.common}>
          <Tabs.Tab label="Booking" icon={<HiOutlineCalendar size={18} />}>
            <BookingTimeListControl
              dateUseState={[currentlySelectedData, setCurrentlySelectedData]}
              handleOnSubmit={handleConfirmAndBook}
              disabled={
                createBookingMutation.isLoading ||
                checkedItems.every((each) => !each)
              }
            />
            <Divider size="sm" className={classes.divider} />
            {availabilities && !!availabilities.length && (
              <BookingTimeList
                pagination={{ numberPerPage: 16 }}
                bookingItems={availabilities}
                style={{ display: 'relative' }}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
              />
            )}
          </Tabs.Tab>
          <Tabs.Tab label="People" icon={<HiOutlineUserGroup size={18} />}>
            <Table>
              <thead>
                <tr>
                  <th>Booked By</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {unavailabilities.map((unavailability, i) => {
                  const start = dayjs(unavailability.startTime);
                  const end = dayjs(unavailability.endTime);

                  return (
                    <tr>
                      <td>{`${unavailability.User.firstName} ${unavailability.User.lastName}`}</td>
                      <td>{start.format('hh:mm A')}</td>
                      <td>{end.format('hh:mm A')}</td>
                      <td
                        className={` ${
                          end.toDate() > new Date()
                            ? classes.greenText
                            : classes.redText
                        }`}
                      >
                        {start.fromNow()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Tabs.Tab>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}

export default BookingPage;
