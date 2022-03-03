import { Navbar } from '@mantine/core';
import { UserRole } from '@prisma/client';
import { HiOutlineCalendar } from 'react-icons/hi';
import { RiFeedbackLine, RiAdminLine } from 'react-icons/ri';
import { useAuth } from '../../context/Authentication';
import AppSideMenuItem, {
  AppSideMenuItemProps,
} from '../app-side-menu-item/app-side-menu-item';
import './app-side-menu.module.css';

/* eslint-disable-next-line */
export interface AppSideMenuProps {}

const admin: AppSideMenuItemProps = {
  label: 'Admin',
  icon: RiAdminLine,
  themeIconProps: {
    color: 'lime',
  },
  initiallyOpened: false,
  links: [
    { label: 'Dashboard', link: '/admin' },
    { label: 'Create', link: '/admin/create' },
  ],
};

const navRoute: AppSideMenuItemProps[] = [
  {
    label: 'Booking',
    icon: HiOutlineCalendar,
    initiallyOpened: true,
    links: [
      { label: 'Availabilities', link: '/' },
      { label: 'My Bookings', link: '/mybooking' },
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

export function AppSideMenu(props: AppSideMenuProps) {
  const auth = useAuth();

  return (
    <Navbar width={{ base: 300 }} padding="xs">
      {navRoute.map((each, key) => {
        return <AppSideMenuItem {...each} key={key} />;
      })}
      {auth.user && auth.user.roles.includes(UserRole.ADMIN) && (
        <AppSideMenuItem {...admin} />
      )}
    </Navbar>
  );
}

export default AppSideMenu;
