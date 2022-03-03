import { Button, createStyles, Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import './booking-time-list-control.module.css';

/* eslint-disable-next-line */
export interface BookingTimeListControlProps {
  dateUseState: [date: Date, setDate: (date: Date) => void];
  handleOnSubmit: () => void;
  disabled: boolean;
}

const useStyles = createStyles(() => ({
  bookingListControlGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
}));

export function BookingTimeListControl({
  dateUseState,
  handleOnSubmit,
  disabled,
}: BookingTimeListControlProps) {
  const [date, setDate] = dateUseState;
  const { classes } = useStyles();

  return (
    <Group className={classes.bookingListControlGroup}>
      <DatePicker
        label="Pick Date"
        value={date}
        onChange={setDate}
        minDate={new Date()}
      />
      <Button color="teal" onClick={handleOnSubmit} disabled={disabled}>
        Confirm & Book
      </Button>
    </Group>
  );
}

export default BookingTimeListControl;
