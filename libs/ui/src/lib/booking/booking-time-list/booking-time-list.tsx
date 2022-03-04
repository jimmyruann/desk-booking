import { createStyles, Group, LoadingOverlay, Pagination } from '@mantine/core';
import dayjs from 'dayjs';
import { useState } from 'react';
import BookingTimeListItem from '../booking-time-list-item/booking-time-list-item';
import './booking-time-list.module.css';

export interface BookingItem {
  startTime: Date;
  endTime: Date;
  disabled: boolean;
  checked: boolean;
}

/* eslint-disable-next-line */
export interface BookingTimeListProps {
  pagination: {
    numberPerPage: number;
  };
  bookingItemUseState: [BookingItem[], (bookingItems: BookingItem[]) => void];
  loading: boolean;
}

const useStyles = createStyles((theme) => ({
  container: {
    position: 'relative',
    paddingBlock: theme.spacing.md,
    minHeight: 400,
  },
  pagination: {
    marginInline: 'auto',
  },
}));

export function BookingTimeList({
  pagination,
  bookingItemUseState,
  loading,
}: BookingTimeListProps) {
  const { classes } = useStyles();
  const [activePage, setPage] = useState(1);
  const [bookingItems, setBookingItems] = bookingItemUseState;

  const handleChecked = (position: number) => {
    setBookingItems(
      bookingItems.map((item, i) => {
        if (i === position) return { ...item, checked: !item.checked };
        return item;
      })
    );
  };

  return (
    <Group spacing="sm" className={classes.container}>
      <LoadingOverlay visible={loading} />
      {bookingItems
        .slice(
          (activePage - 1) * pagination.numberPerPage,
          activePage * pagination.numberPerPage
        )
        .map(({ startTime, endTime, ...rest }, i) => (
          <BookingTimeListItem
            key={i}
            onClick={() =>
              handleChecked(i + (activePage - 1) * pagination.numberPerPage)
            }
            {...rest}
          >
            {`${dayjs(startTime).format('hh:mm A')} - ${dayjs(endTime).format(
              'hh:mm A'
            )}`}
          </BookingTimeListItem>
        ))}
      {bookingItems.length && (
        <div className={classes.pagination}>
          <Pagination
            page={activePage}
            onChange={setPage}
            total={Math.ceil(bookingItems.length / pagination.numberPerPage)}
          />
        </div>
      )}
    </Group>
  );
}

export default BookingTimeList;
