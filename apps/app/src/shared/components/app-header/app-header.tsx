import {
  ActionIcon,
  Burger,
  createStyles,
  Header,
  MediaQuery,
  Menu,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { MdOutlineMyLocation } from 'react-icons/md';
import { useMapLocation } from '../../context/MapLocation.context';
// import { useUserLocation } from '../../context/UserLocation';

/* eslint-disable-next-line */
export interface AppHeaderProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  active: {
    backgroundColor: theme.colors['teal'][2],
  },
}));

export function AppHeader({ opened, setOpened }: AppHeaderProps) {
  const userLocation = useMapLocation();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const renderLocations =
    userLocation.locations.length &&
    userLocation.locations.map((each) => (
      <Menu.Item
        key={each.locationId}
        className={
          userLocation.currentLocation.locationId === each.locationId &&
          classes.active
        }
        onClick={() => userLocation.changeCurrentLocation(each.locationId)}
        data-cy={`location-${each.locationId}`}
      >
        {each.displayName}
      </Menu.Item>
    ));

  return (
    <Header height={60} p="md" fixed className={classes.header} id="navHeader">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>Desk Booking Service</Text>
      </div>
      <div>
        <Menu
          control={
            <ActionIcon data-cy="changeLocationButton">
              <MdOutlineMyLocation size={18} />
            </ActionIcon>
          }
        >
          <Menu.Label data-cy="locationMenuLabel">Location</Menu.Label>
          {renderLocations}
        </Menu>
      </div>
    </Header>
  );
}

export default AppHeader;
