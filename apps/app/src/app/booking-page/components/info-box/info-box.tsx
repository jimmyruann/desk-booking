import './info-box.module.css';
import { DigitalTime } from '@desk-booking/ui';
import { createStyles, Group, Text } from '@mantine/core';
import { useUserLocation } from '../../../../shared/context/UserLocation';
import { useBookingPage } from '../../context/BookingPageContext';

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

/* eslint-disable-next-line */
export interface InfoBoxProps {}

export function InfoBox(props: InfoBoxProps) {
  const { classes } = useStyles();

  const userLocation = useUserLocation();
  const bookingPage = useBookingPage();

  return (
    <Group direction="column" className={classes.common}>
      <section>
        <Text data-cy="svgMapHeadingLocation">
          Location: <b>{userLocation.location.displayName}</b>
        </Text>
        <Text data-cy="svgMapHeadingHtmlId">
          Area: <b>{bookingPage.currentHtmlId || '-'}</b>
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
  );
}

export default InfoBox;
