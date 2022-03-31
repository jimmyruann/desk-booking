import {
  Button,
  Group,
  NativeSelect,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { TimeRangeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import TimeZones from '../../../../../../assets/timezones.json';

export type LocationFormInputProps = {
  displayName: string;
  timeZone: string;
  mapUrl: string;
  capacity: number;
  allowBookingBetween: Date[];
};

/* eslint-disable-next-line */
export interface LocationSettingFormProps {
  form: UseFormReturnType<LocationFormInputProps>;
  handleFormSubmit: (values: LocationFormInputProps) => void;
}

export function LocationSettingForm({
  form,
  handleFormSubmit,
}: LocationSettingFormProps) {
  return (
    <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
      <Group direction="column" grow>
        <TextInput
          placeholder="Display Name"
          label="Display Name"
          name="displayName"
          required
          {...form.getInputProps('displayName')}
        />

        <NativeSelect
          label="Location Timezone"
          name="timeZone"
          placeholder="Pick one"
          required
          data={TimeZones}
          {...form.getInputProps('timeZone')}
        />

        <TextInput
          placeholder="Map URL"
          label="Map URL"
          name="mapUrl"
          required
          {...form.getInputProps('mapUrl')}
        />

        <NumberInput
          defaultValue={100}
          placeholder="%"
          name="capacity"
          label="Desk Capacity %"
          max={100}
          min={0}
          required
          {...form.getInputProps('capacity')}
        />

        <TimeRangeInput
          label="Allow Booking Between"
          hoursLabel="Hours"
          minutesLabel="Minutes"
          required
          {...form.getInputProps('allowBookingBetween')}
        />

        <Button fullWidth color="teal" type="submit">
          Update
        </Button>
      </Group>
    </form>
  );
}

export default LocationSettingForm;
