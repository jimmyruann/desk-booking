import { Button, createStyles, Group, SimpleGrid } from '@mantine/core';
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
  datePicker: {
    width: '100%',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'end',
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
    <SimpleGrid cols={2}>
      <DatePicker
        label="Pick Date"
        value={date}
        onChange={setDate}
        minDate={new Date()}
        required
        excludeDate={(date) => date.getDay() === 0 || date.getDay() === 6}
        firstDayOfWeek="sunday"
        className={classes.datePicker}
        allowFreeInput
      />
      <div className={classes.buttonWrapper}>
        <Button
          color="teal"
          onClick={handleOnSubmit}
          disabled={disabled}
          fullWidth
        >
          Confirm & Book
        </Button>
      </div>
    </SimpleGrid>
  );
}

export default BookingTimeListControl;
