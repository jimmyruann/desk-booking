import { AppShell } from '@mantine/core';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { withMapLocationProvider } from '../../context/MapLocation.context';
import AppHeader from '../app-header/app-header';
import AppSideMenu from '../app-side-menu/app-side-menu';

/* eslint-disable-next-line */
export interface AppLayoutProps {}

export function AppLayout(props: AppLayoutProps) {
  const [opened, setOpened] = useState(false);

  return (
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
  );
}

export default withMapLocationProvider(AppLayout);
