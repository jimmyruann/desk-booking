import { Button, createStyles, SimpleGrid } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import './booking-control.module.css';

const useStyles = createStyles((theme) => ({
  datePicker: {
    width: '100%',
  },
}));

/* eslint-disable-next-line */
export interface BookingControlProps {
  dateHook: [Date, (date: Date) => void];
  handleSubmit: () => void;
  disableButton: boolean;
}

export function BookingControl({
  dateHook,
  handleSubmit,
  disableButton,
}: BookingControlProps) {
  const { classes } = useStyles();
  const [date, setDate] = dateHook;

  return (
    <SimpleGrid
      cols={2}
      sx={() => ({
        alignItems: 'end',
      })}
    >
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
        clearable={false}
        data-cy="selectDate"
      />
      <Button
        color="teal"
        onClick={handleSubmit}
        disabled={disableButton}
        fullWidth
        id="submitBookings"
      >
        Confirm & Book
      </Button>
    </SimpleGrid>
  );
}

export default BookingControl;
