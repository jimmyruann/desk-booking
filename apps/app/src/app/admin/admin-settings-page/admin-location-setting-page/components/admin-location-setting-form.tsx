import { LocationEntity, UpdateLocationDto } from '@desk-booking/data';
import {
  Button,
  Checkbox,
  Group,
  Loader,
  NativeSelect,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { TimeRangeInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import { Location } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import z from 'zod';
import { axiosApiClient } from '../../../../../shared/api';

const formSchema = z.object({
  displayName: z.string().nonempty(),
  timeZone: z.string().nonempty(),
  mapUrl: z.string().nonempty(),
  capacity: z.number().min(0).max(100),
  allowBookingBetween: z.date().array(),
  disabled: z.boolean(),
});

const updateLocation = async (id: number, values: UpdateLocationDto) => {
  const { data } = await axiosApiClient.patch<LocationEntity>(
    `/locations/${id}`,
    values
  );
  return data;
};

const getTimeZone = async () => {
  const { data } = await axios.get<string[]>('/assets/timezones.json');
  return data;
};

const transformLocationData = (location: LocationEntity) => {
  return {
    displayName: location.displayName,
    timeZone: location.timeZone,
    mapUrl: location.mapUrl,
    capacity: location.capacity,
    allowBookingBetween: [
      dayjs().startOf('day').add(location.allowBookingFrom, 'minute').toDate(),
      dayjs().startOf('day').add(location.allowBookingTill, 'minute').toDate(),
    ],
    disabled: location.disabled,
  };
};

export function AdminLocationSettingForm({ location }: { location: Location }) {
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const [initFormValue, setInitFormValue] = useState(
    transformLocationData(location)
  );

  const updateLocationSettingForm = useForm({
    schema: zodResolver(formSchema),
    initialValues: initFormValue,
  });

  const updateLocationMutation = useMutation(
    ({
      id,
      values,
    }: {
      id: number;
      values: typeof updateLocationSettingForm['values'];
    }) => {
      const { allowBookingBetween, ...rest } = values;
      const updateData = {
        ...rest,
        allowBookingFrom:
          allowBookingBetween[0].getHours() * 60 +
          allowBookingBetween[0].getMinutes(),
        allowBookingTill:
          allowBookingBetween[1].getHours() * 60 +
          allowBookingBetween[1].getMinutes(),
      };
      return updateLocation(id, updateData);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['getLocations']);
        setInitFormValue(transformLocationData(data));
        notifications.showNotification({
          color: 'green',
          title: 'Successfully Updated',
          message: `${data.displayName} was updated.`,
        });
      },
    }
  );

  const getTimeZonesQuery = useQuery('timezones', getTimeZone, {
    staleTime: Infinity,
  });

  useEffect(() => {
    setInitFormValue(transformLocationData(location));
  }, [location]);

  useEffect(() => {
    updateLocationSettingForm.setValues(initFormValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initFormValue]);

  if (getTimeZonesQuery.status === 'loading')
    return <div>Loading Time Zones...</div>;
  if (getTimeZonesQuery.status === 'error')
    return <div>Unable to get timezones</div>;

  return (
    <form
      onSubmit={updateLocationSettingForm.onSubmit((values) => {
        updateLocationMutation.mutate({
          id: location.id,
          values,
        });
      })}
    >
      <Group direction="column" grow>
        <TextInput
          placeholder="Display Name"
          label="Display Name"
          name="displayName"
          required
          {...updateLocationSettingForm.getInputProps('displayName')}
        />

        <NativeSelect
          label="Location Timezone"
          name="timeZone"
          placeholder="Pick one"
          required
          data={getTimeZonesQuery.data}
          {...updateLocationSettingForm.getInputProps('timeZone')}
        />

        <TextInput
          placeholder="Map URL"
          label="Map URL"
          name="mapUrl"
          required
          {...updateLocationSettingForm.getInputProps('mapUrl')}
        />

        <NumberInput
          defaultValue={100}
          placeholder="%"
          name="capacity"
          label="Desk Capacity %"
          max={100}
          min={0}
          required
          {...updateLocationSettingForm.getInputProps('capacity')}
        />

        <TimeRangeInput
          label="Allow Booking Between"
          hoursLabel="Hours"
          minutesLabel="Minutes"
          required
          {...updateLocationSettingForm.getInputProps('allowBookingBetween')}
        />

        <Checkbox
          label="Disable Location"
          checked={updateLocationSettingForm.getInputProps('disabled').value}
          {...updateLocationSettingForm.getInputProps('disabled')}
        />

        <Button
          fullWidth
          color="teal"
          type="submit"
          disabled={
            updateLocationMutation.isLoading ||
            JSON.stringify(updateLocationSettingForm.values) ===
              JSON.stringify(initFormValue)
          }
        >
          {updateLocationMutation.isLoading ? <Loader /> : <>Update</>}
        </Button>
      </Group>
    </form>
  );
}

export default AdminLocationSettingForm;
