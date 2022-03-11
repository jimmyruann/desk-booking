import { environment } from '../../../../environments/environment';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import { useBookingPage } from '../../context/BookingPageContext';
import './map-box.module.css';
import { useNotifications } from '@mantine/notifications';
import { createStyles } from '@mantine/core';
import { Loading, Map, Node } from '@desk-booking/ui';

/* eslint-disable-next-line */
export interface MapBoxProps {}

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
export function MapBox(props: MapBoxProps) {
  const { classes } = useStyles();
  const userLocation = useUserLocation();
  const bookingPage = useBookingPage();
  const notifications = useNotifications();

  const { data, status } = useQuery(
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

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <div>Something went wrong</div>;

  return (
    <div className={classes.common}>
      <Map
        mapData={data}
        viewBox={
          data.attributes['viewBox'] &&
          data.attributes['viewBox']
            .split(' ')
            .map((each) => parseInt(each) || 0)
        }
        currentHtmlId={bookingPage.currentHtmlId}
        setCurrentHtmlId={bookingPage.setCurrentHtmlId}
        data-cy={`svgMap-${userLocation.location.name}`}
      />
    </div>
  );
}

export default MapBox;
