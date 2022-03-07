import { AppShell } from '@mantine/core';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { UserLocationProvider } from '../../context/UserLocation';
import AppHeader from '../app-header/app-header';
import AppSideMenu from '../app-side-menu/app-side-menu';
import './app-layout.module.css';

/* eslint-disable-next-line */
export interface AppLayoutProps {}

export function AppLayout(props: AppLayoutProps) {
  const [opened, setOpened] = useState(false);

  return (
    <UserLocationProvider>
      <AppShell
        fixed
        navbarOffsetBreakpoint="sm"
        header={<AppHeader opened={opened} setOpened={setOpened} />}
        navbar={<AppSideMenu opened={opened} />}
        zIndex={100}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
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
