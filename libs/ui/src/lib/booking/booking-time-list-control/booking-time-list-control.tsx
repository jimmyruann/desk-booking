import { Button, createStyles, SimpleGrid } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import './booking-time-list-control.module.css';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/* eslint-disable-next-line */
export interface BookingTimeListControlProps {
  date: Date;
  setDate: (date: Date) => void;
  handleOnSubmit: () => void;
  disabled: boolean;
}

const useStyles = createStyles(() => ({
  bookingListControlGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  datePicker: {
    width: '100%',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'end',
  },
}));

export function BookingTimeListControl({
  date,
  setDate,
  handleOnSubmit,
  disabled,
}: BookingTimeListControlProps) {
  const { classes } = useStyles();

  return (
    <SimpleGrid cols={2}>
      <DatePicker
        label="Pick Date"
        value={date}
        onChange={setDate}
        minDate={dayjs(new Date()).utc().toDate()}
        required
        excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
        firstDayOfWeek="sunday"
        className={classes.datePicker}
        allowFreeInput
        clearable={false}
        data-cy="selectDate"
      />
      <div className={classes.buttonWrapper}>
        <Button
          color="teal"
          onClick={handleOnSubmit}
          disabled={disabled}
          fullWidth
          id="submitBookings"
        >
          Confirm & Book
        </Button>
      </div>
    </SimpleGrid>
  );
}

export default BookingTimeListControl;
