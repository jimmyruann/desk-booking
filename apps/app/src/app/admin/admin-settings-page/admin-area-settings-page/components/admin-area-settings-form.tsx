import { AreaEntity, AreaTypeEntity } from '@desk-booking/data';
import {
  Button,
  Checkbox,
  Group,
  Input,
  InputWrapper,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { useMutation, useQueries, useQueryClient } from 'react-query';
import { z } from 'zod';
import { axiosApiClient } from '../../../../../shared/api';
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

const initialValues = {
  id: 0,
  locationId: 0,
  htmlId: '',
  displayName: '',
  areaTypeId: 0,
  allowBooking: false,
};

export const AdminAreaSettingsForm = ({
  htmlId,
}: AdminAreaSettingsFormProps) => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const userLocation = useMapLocation();

  const form = useForm<AreaEntity>({
    schema: zodResolver(areaSettingFormSchema),
    initialValues,
  });

  useEffect(() => {
    form.setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.currentLocation]);

  const updateAreaSettingMutation = useMutation(
    (values: AreaEntity) => updateAreaData(values),
    {
      onSuccess: (data) => {
        form.setValues(data);
        notifications.showNotification({
          color: 'green',
          title: 'Success',
          message: `Updated area id: ${data.id} (${data.displayName})`,
        });

        queryClient.invalidateQueries(['locations']);
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

  const queries = useQueries([
    { queryKey: 'areaTypes', queryFn: getAreaTypes },
    {
      queryKey: ['area', htmlId],
      queryFn: () => getAreaData(htmlId),
      onSuccess: (area: AreaEntity) => form.setValues(area),
    },
  ]);

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  const areaTypes = queries[0].data;
  const area = queries[1].data;

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
        updateAreaSettingMutation.mutate(values);
      })}
      data-testid="adminAreaSettingsForm"
    >
      <Group direction="column" grow>
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
            {areaTypes.map((areaType) => (
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
          disabled={
            JSON.stringify(area) === JSON.stringify(form.values) ||
            JSON.stringify(initialValues) === JSON.stringify(form.values)
          }
        >
          Update Record
        </Button>
      </Group>
    </form>
  );
};

export default AdminAreaSettingsForm;
