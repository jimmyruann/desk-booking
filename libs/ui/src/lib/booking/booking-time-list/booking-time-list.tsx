import { Group, Pagination } from '@mantine/core';
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
}

export function BookingTimeList({
  pagination,
  bookingItemUseState,
}: BookingTimeListProps) {
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
    <Group spacing="sm" className="tw-py-4">
      {bookingItems
        .slice(
          (activePage - 1) * pagination.numberPerPage,
          activePage * pagination.numberPerPage
        )
        .map(({ startTime, endTime, ...rest }, i) => (
          <BookingTimeListItem
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
      <div className="tw-mx-auto">
        <Pagination
          page={activePage}
          onChange={setPage}
          total={Math.ceil(bookingItems.length / pagination.numberPerPage)}
        />
      </div>
    </Group>
  );
}

export default BookingTimeList;
