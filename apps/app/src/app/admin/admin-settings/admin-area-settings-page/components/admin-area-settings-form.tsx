import { AreaEntity, AreaTypeEntity } from '@desk-booking/data';
import {
  Button,
  Checkbox,
  Group,
  Input,
  InputWrapper,
  NumberInput,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { HiChevronDown } from 'react-icons/hi';
import { useMutation, useQuery } from 'react-query';
import { z } from 'zod';
import { axiosApiClient } from '../../../../../shared/api/api';
import Loading from '../../../../../shared/components/loading/loading';
import { useMapLocation } from '../../../../../shared/context/MapLocation.context';

interface AdminAreaSettingsFormProps {
  htmlId: string;
}

const getAreaData = async (htmlId: string) => {
  const { data } = await axiosApiClient.get<AreaEntity>(`/areas/${htmlId}`);
  return data;
};

const getAreaTypes = async () => {
  const { data } = await axiosApiClient.get<AreaTypeEntity[]>('/area-types');
  return data;
};

const updateAreaData = async ({ id, ...values }: AreaEntity) => {
  const { data } = await axiosApiClient.patch<AreaEntity>(
    `/areas/${id}`,
    values
  );
  return data;
};

const areaSettingFormSchema = z.object({
  id: z.number().positive(),
  htmlId: z.string().min(1),
  displayName: z.string().min(1),
  locationId: z.number().positive(),
  areaTypeId: z.number().positive(),
  allowBooking: z.boolean(),
});

export const AdminAreaSettingsForm = ({
  htmlId,
  ...props
}: AdminAreaSettingsFormProps) => {
  const notifications = useNotifications();
  const mapLocations = useMapLocation();
  const form = useForm<AreaEntity>({
    schema: zodResolver(areaSettingFormSchema),
    initialValues: {
      id: 0,
      htmlId: '',
      displayName: '',
      locationId: 0,
      areaTypeId: 0,
      allowBooking: true,
    },
  });

  const { data: areaData, status: areaDataStatus } = useQuery(
    ['area', htmlId],
    () => getAreaData(htmlId),
    {
      onSuccess: (areaData) => {
        form.setValues(areaData);
      },
    }
  );

  const { data: areaTypesData, status: areaTypesDataStatus } = useQuery(
    'areaTypes',
    () => getAreaTypes()
  );

  const updateAreaSettingMutation = useMutation(
    (values: AreaEntity) => updateAreaData(values),
    {
      onSuccess: (data) => {
        form.setValues({
          ...data,
        });
        notifications.showNotification({
          color: 'green',
          title: 'Success',
          message: `Updated area id: ${data.id} (${data.displayName})`,
        });
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: 'Failed',
          message:
            error.response.data.message ||
            error.message ||
            'Something went wrong',
        });
      },
    }
  );

  if (areaDataStatus === 'loading' || areaTypesDataStatus === 'loading')
    return <Loading />;
  if (areaDataStatus === 'error' || areaTypesDataStatus === 'error')
    return <div>Something went wrong</div>;

  return (
    <form
      {...props}
      onSubmit={form.onSubmit((values) =>
        updateAreaSettingMutation.mutate(values)
      )}
      data-testid="adminAreaSettingsForm"
    >
      <Group direction="column" grow>
        <InputWrapper label="ID" required aria-disabled>
          <NumberInput name="id" disabled {...form.getInputProps('id')} />
        </InputWrapper>

        <InputWrapper label="Location" required aria-disabled>
          <Input
            name="locationId"
            component="select"
            rightSection={<HiChevronDown />}
            disabled
            {...form.getInputProps('locationId')}
          >
            {mapLocations.locations.map((location) => (
              <option value={location.id} key={location.id}>
                {location.displayName}
              </option>
            ))}
          </Input>
        </InputWrapper>

        <InputWrapper label="HTML ID" required>
          <TextInput name="htmlId" {...form.getInputProps('htmlId')} />
        </InputWrapper>

        <InputWrapper label="Display Name" required>
          <TextInput
            name="displayName"
            {...form.getInputProps('displayName')}
          />
        </InputWrapper>

        <InputWrapper label="Area Type" required>
          <Input
            name="areaTypeId"
            component="select"
            rightSection={<HiChevronDown />}
            {...form.getInputProps('areaTypeId')}
          >
            {areaTypesData.map((areaType) => (
              <option value={areaType.id} key={areaType.id}>
                {areaType.name.toUpperCase()}
              </option>
            ))}
          </Input>
        </InputWrapper>

        <Checkbox
          name="allowBooking"
          label="Allow to Be Booked"
          checked={form.getInputProps('allowBooking').value}
          onChange={form.getInputProps('allowBooking').onChange}
        />

        <Button
          color="orange"
          uppercase
          fullWidth
          type="submit"
          disabled={JSON.stringify(areaData) === JSON.stringify(form.values)}
        >
          Update Record
        </Button>
      </Group>
    </form>
  );
};

export default AdminAreaSettingsForm;
