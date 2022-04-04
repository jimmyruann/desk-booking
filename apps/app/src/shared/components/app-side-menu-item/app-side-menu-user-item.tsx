import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import React from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

/* eslint-disable-next-line */
export interface AppSideMenuUserItemProps
  extends UnstyledButtonProps<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export const AppSideMenuUserItem = React.forwardRef<
  HTMLButtonElement,
  AppSideMenuUserItemProps
>(({ image, name, email, icon, ...others }: AppSideMenuUserItemProps, ref) => (
  <UnstyledButton
    ref={ref}
    sx={(theme) => ({
      display: 'block',
      width: '100%',
      padding: theme.spacing.md,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      },
    })}
    {...others}
  >
    <Group>
      <Avatar src={image} radius="xl" />

      <div style={{ flex: 1 }}>
        <Text size="sm" weight={500}>
          {name}
        </Text>

        <Text color="dimmed" size="xs">
          {email}
        </Text>
      </div>

      {icon || <HiOutlineChevronRight size={14} />}
    </Group>
  </UnstyledButton>
));

export default AppSideMenuUserItem;
