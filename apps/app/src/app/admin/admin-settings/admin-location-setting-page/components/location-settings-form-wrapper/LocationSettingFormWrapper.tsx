import { LocationEntity, UpdateLocationDto } from '@desk-booking/data';
import { useForm, zodResolver } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import { Location } from '@prisma/client';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import z from 'zod';
import { axiosApiClient } from '../../../../../../shared/api';
import LocationSettingForm, {
  LocationFormInputProps,
} from '../location-settings-form/LocationSettingForm';

/* eslint-disable-next-line */
export interface LocationSettingFormWrapperProps {
  location: Location;
}

const formSchema = z.object({
  displayName: z.string().nonempty(),
  timeZone: z.string().nonempty(),
  mapUrl: z.string().nonempty(),
  capacity: z.number().min(0).max(100),
  allowBookingBetween: z.date().array(),
});

const updateLocation = async (id: number, values: UpdateLocationDto) => {
  const { data } = await axiosApiClient.patch<LocationEntity>(
    `/locations/${id}`,
    values
  );
  return data;
};

export function LocationSettingFormWrapper({
  location,
}: LocationSettingFormWrapperProps) {
  const transformLocationToFormValues = (
    location: Location
  ): LocationFormInputProps => {
    return {
      displayName: location.displayName,
      timeZone: location.timeZone,
      mapUrl: location.mapUrl,
      capacity: location.capacity,
      allowBookingBetween: [
        dayjs()
          .startOf('day')
          .add(location.allowBookingFrom, 'minute')
          .toDate(),
        dayjs()
          .startOf('day')
          .add(location.allowBookingTill, 'minute')
          .toDate(),
      ],
    };
  };

  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const updateLocationSettingForm = useForm<LocationFormInputProps>({
    schema: zodResolver(formSchema),
    initialValues: transformLocationToFormValues(location),
  });

  const updateLocationMutation = useMutation(
    ({ id, values }: { id: number; values: LocationFormInputProps }) => {
      const { allowBookingBetween, ...rest } = values;

      return updateLocation(id, {
        ...rest,
        allowBookingFrom:
          allowBookingBetween[0].getHours() * 60 +
          allowBookingBetween[0].getMinutes(),
        allowBookingTill:
          allowBookingBetween[1].getHours() * 60 +
          allowBookingBetween[1].getMinutes(),
      });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['GET_ALL_LOCATIONS']);
        notifications.showNotification({
          color: 'green',
          title: 'Successfully Updated',
          message: `${data.displayName} was updated.`,
        });
      },
    }
  );

  useEffect(() => {
    updateLocationSettingForm.setValues(
      transformLocationToFormValues(location)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <LocationSettingForm
      form={updateLocationSettingForm}
      handleFormSubmit={(values) =>
        updateLocationMutation.mutate({
          id: location.id,
          values,
        })
      }
    />
  );
}

export default LocationSettingFormWrapper;
