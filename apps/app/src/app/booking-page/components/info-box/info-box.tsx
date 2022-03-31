import { createStyles, Group, Text } from '@mantine/core';
import { useMapLocation } from '../../../../shared/context/MapLocation.context';
// import { useUserLocation } from '../../../../shared/context/UserLocation';

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
}));

/* eslint-disable-next-line */
export interface InfoBoxProps {
  htmlId: string;
}

export function InfoBox({ htmlId }: InfoBoxProps) {
  const { classes } = useStyles();

  const userLocation = useMapLocation();

  return (
    <Group direction="column">
      <section>
        <Text data-cy="svgMapHeadingLocation">
          Location: <b>{userLocation.currentLocation.displayName}</b>
        </Text>
        <Text data-cy="svgMapHeadingHtmlId">
          Area: <b>{htmlId || '-'}</b>
        </Text>
      </section>
      <section>
        <Text weight={500} size="md" color="orange">
          Note*
        </Text>
        <Text data-cy="currentLocationTimeZone">
          Timezone: <b>{userLocation.currentLocation.timeZone}</b>.
        </Text>
      </section>
    </Group>
  );
}

export default InfoBox;
