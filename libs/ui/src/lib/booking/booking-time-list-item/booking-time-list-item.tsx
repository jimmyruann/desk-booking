import React from 'react';
import { Button, createStyles } from '@mantine/core';
import './booking-time-list-item.module.css';

/* eslint-disable-next-line */
export interface BookingTimeListItemProps {
  children: React.ReactNode;
  checked: boolean;
  disabled: boolean;
  onClick: () => void;
}

const useStyles = createStyles((theme, params: boolean) => ({
  button: {
    backgroundColor: params ? theme.colors.green[1] : '',
    '&:hover': {
      backgroundColor: theme.colors.green[1],
    },
  },
  text: {
    textAlign: 'center',
  },
}));

export function BookingTimeListItem({
  children,
  checked,
  disabled,
  onClick,
}: BookingTimeListItemProps) {
  const { classes } = useStyles(checked);

  return (
    <Button
      variant="outline"
      color="green"
      fullWidth
      disabled={disabled}
      onClick={onClick}
      className={classes.button}
    >
      <span className={classes.text}>{children}</span>
    </Button>
  );
}

export default BookingTimeListItem;
