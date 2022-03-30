import { LocationEntity } from '@desk-booking/data';
import { AppShell } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Outlet } from 'react-router';
import { axiosApiClient } from '../../api/api';
import { UserLocationProvider } from '../../context/UserLocation';
import AppHeader from '../app-header/app-header';
import AppSideMenu from '../app-side-menu/app-side-menu';
import { ServerError } from '../errors/server-error';
import Loading from '../loading/loading';

/* eslint-disable-next-line */
export interface AppLayoutProps {}

const getLocations = async () => {
  const { data } = await axiosApiClient.get<LocationEntity[]>('/locations');
  return data;
};

export function AppLayout(props: AppLayoutProps) {
  const [opened, setOpened] = useState(false);
  const currentLocationId =
    localStorage.getItem('location_name') || 'sydney_lv18';
  const { data: locations, status } = useQuery('getLocations', () =>
    getLocations()
  );

  if (status === 'loading') return <Loading fullscreen />;
  if (status === 'error') return <ServerError />;

  return (
    <UserLocationProvider
      currentLocationId={currentLocationId}
      locations={locations}
    >
      <AppShell
        fixed
        navbarOffsetBreakpoint="sm"
        header={<AppHeader opened={opened} setOpened={setOpened} />}
        navbar={<AppSideMenu opened={opened} />}
        zIndex={100}
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colors.gray[0],
            paddingTop: 'calc(60px + 16px)',
            [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
              paddingLeft: 'calc(300px + 16px)',
            },
          },
        })}
      >
        <Outlet />
      </AppShell>
    </UserLocationProvider>
  );
}

export default AppLayout;
