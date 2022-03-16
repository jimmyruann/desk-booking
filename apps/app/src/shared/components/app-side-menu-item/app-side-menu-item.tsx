import {
  Box,
  Collapse,
  createStyles,
  Group,
  ThemeIcon,
  ThemeIconProps,
  UnstyledButton,
} from '@mantine/core';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import './app-side-menu-item.module.css';

/* eslint-disable-next-line */
export interface AppSideMenuItemProps {
  icon: IconType;
  themeIconProps?: Pick<ThemeIconProps, 'color' | 'gradient'>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

export function AppSideMenuItem({
  icon: Icon,
  themeIconProps,
  label,
  initiallyOpened,
  links,
}: AppSideMenuItemProps) {
  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon =
    theme.dir === 'ltr' ? HiOutlineChevronRight : HiOutlineChevronLeft;
  const items = (hasLinks ? links : []).map((link) => (
    <Link to={link.link} key={link.label} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30} {...themeIconProps}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? (
        <Collapse in={opened} data-cy="sideBarItemList">
          {items}
        </Collapse>
      ) : null}
    </>
  );
}

export default AppSideMenuItem;
