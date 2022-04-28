import { AreaEntity } from '@desk-booking/data';
import { Button, createStyles, Group, Select, SimpleGrid } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

const useStyles = createStyles((theme) => ({
  datePicker: {
    width: '100%',
  },
}));

/* eslint-disable-next-line */
export interface BookingControlProps {
  areasData: AreaEntity[];
  useHtmlId: () => [string, (htmlId: string) => void];
  useDate: () => [Date, (date: Date) => void];
  handleSubmit: () => void;
  disableButton?: boolean;
}

export function BookingControl({
  areasData,
  useHtmlId,
  useDate,
  handleSubmit,
  disableButton,
}: BookingControlProps) {
  const { classes } = useStyles();
  const [htmlId, setHtmlId] = useHtmlId();
  const [date, setDate] = useDate();

  return (
    <Group grow direction="column" spacing="sm">
      <Select
        data={areasData.map((area) => ({
          label: area.displayName,
          value: area.htmlId,
        }))}
        value={htmlId}
        onChange={setHtmlId}
        label="Select Area"
        required
      />
      <SimpleGrid
        cols={2}
        sx={() => ({
          alignItems: 'end',
        })}
        data-testid="bookingControls"
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
    </Group>
  );
}

export default BookingControl;
