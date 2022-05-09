import { createStyles, Menu, Navbar } from '@mantine/core';
import { UserRole } from '@prisma/client';
import { HiOutlineCalendar } from 'react-icons/hi';
import { MdLogout } from 'react-icons/md';
import { RiAdminLine, RiFeedbackLine } from 'react-icons/ri';
import { useAuth } from '../../context/Authentication.context';
import AppSideMenuItem, {
  AppSideMenuItemProps,
} from '../app-side-menu-item/app-side-menu-item';
import AppSideMenuUserItem from '../app-side-menu-item/app-side-menu-user-item';

/* eslint-disable-next-line */
export interface AppSideMenuProps {
  opened: boolean;
}

const admin: AppSideMenuItemProps = {
  label: 'Admin',
  icon: RiAdminLine,
  themeIconProps: {
    color: 'lime',
  },
  initiallyOpened: false,
  links: [
    { label: 'Dashboard', link: '/admin' },
    { label: 'App Settings', link: '/admin/settings' },
    { label: 'User Feedbacks', link: '/admin/feedbacks' },
  ],
};

const navRoute: AppSideMenuItemProps[] = [
  {
    label: 'Booking',
    icon: HiOutlineCalendar,
    initiallyOpened: false,
    links: [
      { label: 'Availabilities', link: '/' },
      { label: 'My Bookings', link: '/bookings/me' },
    ],
  },
  {
    label: 'Feedback',
    icon: RiFeedbackLine,
    themeIconProps: {
      color: 'yellow',
    },
    links: [{ label: 'Give Feedback', link: '/feedback' }],
  },
];

const useStyles = createStyles((theme, __params, getRef) => ({
  navBar: {
    left: 0,
    top: 60,
    height: `calc(100vh - 60px)`,
    zIndex: 100,
    padding: theme.spacing.md,
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: 300,
    },
  },
}));

export function AppSideMenu({ opened }: AppSideMenuProps) {
  const auth = useAuth();
  const { classes } = useStyles();
  return (
    <Navbar
      hidden={!opened}
      id="navSideBar"
      className={classes.navBar}
      hiddenBreakpoint="sm"
      fixed
    >
      <Navbar.Section grow>
        {navRoute.map((each, key) => (
          <AppSideMenuItem {...each} key={key} />
        ))}
        {auth.user && auth.user.roles.includes(UserRole.ADMIN) && (
          <AppSideMenuItem {...admin} />
        )}
      </Navbar.Section>
      <Navbar.Section>
        <Menu
          position="right"
          placement="end"
          size="lg"
          data-cy="userMenu"
          control={
            <AppSideMenuUserItem
              image="data:image/png;base64,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"
              name={`${auth.user.firstName} ${auth.user.lastName}`}
              email={auth.user.email}
              data-cy="userMenuButton"
            />
          }
          sx={() => ({
            width: '100%',
          })}
        >
          <Menu.Label>Application</Menu.Label>
          <Menu.Item
            icon={<MdLogout size={16} />}
            onClick={() => auth.logout()}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Navbar.Section>
    </Navbar>
  );
}

export default AppSideMenu;
