import {
  createStyles,
  Divider,
  Pagination,
  SimpleGrid,
  Space,
} from '@mantine/core';
import dayjs from 'dayjs';
import { useState } from 'react';
import BookingTimeListItem from '../booking-time-list-item/booking-time-list-item';
import './booking-time-list.module.css';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface BookingItem {
  startTime: Date;
  endTime: Date;
  disabled: boolean;
}

/* eslint-disable-next-line */
export interface BookingTimeListProps extends React.HTMLProps<HTMLDivElement> {
  pagination: {
    numberPerPage: number;
  };
  bookingItems: BookingItem[];
  checkedItems: boolean[];
  setCheckedItems: (checkedItems: boolean[]) => void;
  timeZone: string;
}

const useStyles = createStyles((theme) => ({
  container: {
    position: 'relative',
    paddingBlock: theme.spacing.md,
    minHeight: 400,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
  },
  divider: {
    marginBlock: theme.spacing.sm,
  },
  grid: {
    marginBlock: theme.spacing.md,
  },
}));

export function BookingTimeList({
  pagination,
  bookingItems,
  checkedItems,
  setCheckedItems,
  timeZone,
  ...props
}: BookingTimeListProps) {
  const { classes } = useStyles();
  const [activePage, setPage] = useState(1);

  const handleChecked = (position: number) => {
    const temp = checkedItems.slice(0);
    temp[position] = !temp[position];
    setCheckedItems(temp);
  };

  return (
    <div {...props}>
      <SimpleGrid
        spacing="sm"
        cols={2}
        className={classes.grid}
        id="availableTimeList"
      >
        {bookingItems
          .slice(
            (activePage - 1) * pagination.numberPerPage,
            activePage * pagination.numberPerPage
          )
          .map(({ startTime, endTime, disabled }, i) => (
            <BookingTimeListItem
              key={i}
              disabled={disabled}
              checked={checkedItems[i]}
              onClick={() =>
                handleChecked(i + (activePage - 1) * pagination.numberPerPage)
              }
            >
              {`${dayjs.tz(startTime, timeZone).format('hh:mm A')} - ${dayjs
                .tz(endTime, timeZone)
                .format('hh:mm A')}`}
            </BookingTimeListItem>
          ))}
      </SimpleGrid>
      {!!bookingItems.length && (
        <div className={classes.pagination}>
          <Pagination
            id="availableTimeListPagination"
            page={activePage}
            onChange={setPage}
            total={Math.ceil(bookingItems.length / pagination.numberPerPage)}
          />
        </div>
      )}
    </div>
  );
}

export default BookingTimeList;
