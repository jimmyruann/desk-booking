import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router';
import AppHeader from '../app-header/app-header';
import AppSideMenu from '../app-side-menu/app-side-menu';
import './app-layout.module.css';

/* eslint-disable-next-line */
export interface AppLayoutProps {}

export function AppLayout(props: AppLayoutProps) {
  return (
    <AppShell
      header={<AppHeader />}
      navbar={<AppSideMenu />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}

export default AppLayout;
