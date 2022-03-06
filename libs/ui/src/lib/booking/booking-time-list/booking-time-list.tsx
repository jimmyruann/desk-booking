import { createStyles, Pagination, SimpleGrid } from '@mantine/core';
import dayjs from 'dayjs';
import { useState } from 'react';
import BookingTimeListItem from '../booking-time-list-item/booking-time-list-item';
import './booking-time-list.module.css';

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
}));

export function BookingTimeList({
  pagination,
  bookingItems,
  checkedItems,
  setCheckedItems,
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
        breakpoints={[
          { maxWidth: 980, cols: 1, spacing: 'sm' },
          { maxWidth: 755, cols: 1, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
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
              {`${dayjs(startTime).format('hh:mm A')} - ${dayjs(endTime).format(
                'hh:mm A'
              )}`}
            </BookingTimeListItem>
          ))}
      </SimpleGrid>
      <br />
      <br />
      <div className={classes.pagination}>
        <Pagination
          page={activePage}
          onChange={setPage}
          total={Math.ceil(bookingItems.length / pagination.numberPerPage)}
        />
      </div>
    </div>
  );
}

export default BookingTimeList;
