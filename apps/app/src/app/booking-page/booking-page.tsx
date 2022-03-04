import './booking-page.module.css';
import {
  BookingItem,
  BookingTimeList,
  BookingTimeListControl,
  Loading,
  Node,
  SVGNode,
  SVGNodeArea,
  Notification,
  NotificationContent,
} from '@desk-booking/ui';
import { Container, Grid } from '@mantine/core';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import { useApi } from '../../shared/context/ApiClient';
import _ from 'lodash';
import dayjs from 'dayjs';
import { generateAvailableTime } from '../../shared/utils/generateAvailableTime';
import { FindOneWithBookingReturn } from '@desk-booking/data';
import ms from 'ms';

/* eslint-disable-next-line */
export interface BookingPageProps {}

export function BookingPage(props: BookingPageProps) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [currentlySelectedData, setCurrentlySelectedData] = useState(
    dayjs().startOf('day').toDate()
  );
  const [currentlySelectedNodeID, setCurrentlySelectedNodeID] = useState('');
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [status, setStatus] = useState<NotificationContent>({
    message: '',
    isError: false,
  });

  const createBookingMutation = useMutation(
    (data: {
      htmlId: string;
      bookings: { startTime: Date; endTime: Date }[];
    }) => {
      return api.client.post('/bookings', data);
    },
    {
      onSuccess: () => {
        setStatus({
          message: '',
          isError: false,
        });
      },
      onError: (error: AxiosError) => {
        setStatus({
          message: error.response.data.message || 'Something went wrong',
          isError: true,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['GET_AREA_BOOKING_DATA']);
      },
    }
  );

  const svgMap = useQuery(
    ['GET_FLOOR_PLAN', 'singapore'] as const,
    async ({ queryKey }) => {
      const { data } = await axios.get<Node>(
        `https://jimmy-floorplan.s3.ap-southeast-2.amazonaws.com/floorplan/${queryKey[1]}.json`
      );

      const grouped = _.groupBy(data.children, (children) => {
        return children.attributes['id'];
      });

      return {
        svgAttributes: data.attributes,
        rooms: grouped['rooms'][0] || null,
        desks: grouped['desks'][0] || null,
        base: grouped['base'][0] || null,
      };
    },
    {
      onError: () => {
        setStatus({
          message: 'Unable to load map data',
          isError: true,
        });
      },
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const selectAreaBookings = useQuery(
    [
      'GET_AREA_BOOKING_DATA',
      { currentlySelectedNodeID, currentlySelectedData },
    ] as const,
    async ({ queryKey }) => {
      if (!queryKey[1].currentlySelectedNodeID) return [];

      // Fetching
      const { data } = await api.client.get<FindOneWithBookingReturn>(
        `/areas/${queryKey[1].currentlySelectedNodeID}/bookings`,
        {
          params: {
            date: queryKey[1].currentlySelectedData,
          },
        }
      );

      return generateAvailableTime({
        from: dayjs(queryKey[1].currentlySelectedData)
          .startOf('day')
          .add(8, 'hour')
          .toDate(),
        to: dayjs(queryKey[1].currentlySelectedData)
          .endOf('day')
          .subtract(4, 'hour')
          .toDate(),
        intervalInMs: data.AreaType.interval || ms('1h'),
        excludes: data.Booking,
        noPastTime: true,
      });
    },
    {
      onSuccess: (data) => setBookingItems(data),
      onError: () => setBookingItems([]),
    }
  );

  const handleConfirmAndBook = () => {
    createBookingMutation.mutate({
      htmlId: currentlySelectedNodeID,
      bookings: bookingItems
        .filter((bookingItem) => bookingItem.checked)
        .map(({ startTime, endTime }) => ({ startTime, endTime })),
    });
  };

  if (svgMap.isLoading) return <Loading />;
  if (svgMap.isError) return <div>Something went wrong</div>;

  return (
    <Container fluid>
      {status.message && (
        <div className="tw-mb-4">
          <Notification
            {...status}
            onClose={() => setStatus({ message: '', isError: false })}
          />
        </div>
      )}

      <Grid grow>
        <Grid.Col md={8}>
          <svg {...svgMap.data.svgAttributes} width="100%">
            <SVGNode node={svgMap.data.base} />
            {svgMap.data.rooms.children.map((each, i) => (
              <SVGNodeArea
                key={i}
                node={each}
                areaType="room"
                currentHtmlId={currentlySelectedNodeID}
                setCurrentHtmlId={setCurrentlySelectedNodeID}
              />
            ))}
            {svgMap.data.desks.children.map((each, i) => (
              <SVGNodeArea
                key={i}
                node={each}
                areaType="desk"
                currentHtmlId={currentlySelectedNodeID}
                setCurrentHtmlId={setCurrentlySelectedNodeID}
              />
            ))}
          </svg>
        </Grid.Col>
        <Grid.Col md={4}>
          <BookingTimeListControl
            dateUseState={[currentlySelectedData, setCurrentlySelectedData]}
            handleOnSubmit={handleConfirmAndBook}
            disabled={
              createBookingMutation.isLoading ||
              !bookingItems.filter((bookingItem) => bookingItem.checked).length
            }
          />
          <BookingTimeList
            pagination={{ numberPerPage: 12 }}
            bookingItemUseState={[bookingItems, setBookingItems]}
            loading={selectAreaBookings.isLoading}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default BookingPage;
