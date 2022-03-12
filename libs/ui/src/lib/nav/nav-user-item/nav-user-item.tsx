import React, { useState } from 'react';
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from '@mantine/core';
import { HiOutlineChevronRight } from 'react-icons/hi';
import './nav-user-item.module.css';

/* eslint-disable-next-line */
export interface NavUserItemProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export const NavUserItem = React.forwardRef<
  HTMLButtonElement,
  NavUserItemProps
>(({ image, name, email, icon, ...others }: NavUserItemProps, ref) => (
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

export default NavUserItem;
