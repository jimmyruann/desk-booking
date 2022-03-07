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
import { VscHome } from 'react-icons/vsc';
import { GiAustralia, GiSydneyOperaHouse } from 'react-icons/gi';

import './app-header.module.css';
import { useUserLocation } from '../../context/UserLocation';

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
    backgroundColor: theme.colors.teal[2],
  },
}));

const locations: {
  name: string;
  key: string;
  icon: React.ReactChild;
}[] = [
  {
    name: 'Singapore',
    key: 'singapore',
    icon: (
      <span role="img" aria-label="Singapore">
        🇸🇬
      </span>
    ),
  },
  {
    name: 'Sydney Lv.16',
    key: 'sydney-lv16',
    icon: (
      <span role="img" aria-label="Australia">
        🇸🇬
      </span>
    ),
  },
  // {
  //   name: 'Sydney Lv.18',
  //   key: 'sydney-lv18',
  //   icon: (
  //     <span role="img" aria-label="Australia">
  //       🇸🇬
  //     </span>
  //   ),
  // },
];

export function AppHeader({ opened, setOpened }: AppHeaderProps) {
  const userLocation = useUserLocation();
  const theme = useMantineTheme();
  const { classes } = useStyles();
  return (
    <Header height={60} padding="md" fixed className={classes.header}>
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
            <ActionIcon>
              <MdOutlineMyLocation size={18} />
            </ActionIcon>
          }
        >
          <Menu.Label>Location</Menu.Label>
          {locations.map((each) => (
            <Menu.Item
              key={each.key}
              icon={each.icon}
              className={userLocation.location === each.key && classes.active}
              onClick={() => userLocation.setLocation(each.key)}
            >
              {each.name}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </Header>
  );
}

export default AppHeader;
