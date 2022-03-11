import { CreateBookingResponse } from '@desk-booking/data';
import { Button, createStyles, SimpleGrid } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useNotifications } from '@mantine/notifications';
import { useApi } from '../../../../shared/context/ApiClient';
import { mergeTime } from '../../../../shared/utils/time';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from 'react-query';
import { useBookingPage } from '../../context/BookingPageContext';
import './booking-control.module.css';

/* eslint-disable-next-line */
export interface BookingControlProps {}

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
  },
  mapHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
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

export function BookingControl(props: BookingControlProps) {
  const { classes } = useStyles();
  const api = useApi();
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const bookingPage = useBookingPage();

  const createBookingMutation = useMutation(
    (data: {
      htmlId: string;
      bookings: { startTime: Date; endTime: Date }[];
    }) => {
      return api.client.post<CreateBookingResponse>('/bookings', data);
    },
    {
      onSuccess: ({ data }) => {
        notifications.showNotification({
          title: 'Booking Confirmed',
          message: `You have booked ${data.htmlId}.`,
        });
      },
      onError: (error: AxiosError) => {
        notifications.showNotification({
          color: 'red',
          title: error.response.data.title || 'Something went wrong',
          message: error.response.data.message || error.message,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['GET_AREA_BOOKING_DATA']);
      },
    }
  );

  const handleConfirmAndBook = () => {
    const checkedTime = bookingPage.checked
      .map(
        (curr, i) =>
          curr && {
            startTime: bookingPage.availabilities[i].startTime,
            endTime: bookingPage.availabilities[i].endTime,
          }
      )
      .filter((curr) => !!curr);

    const bookings = mergeTime(checkedTime);

    createBookingMutation.mutate({
      htmlId: bookingPage.currentHtmlId,
      bookings,
    });
  };

  return (
    <SimpleGrid
      cols={2}
      sx={() => ({
        alignItems: 'end',
      })}
    >
      <DatePicker
        label="Pick Date"
        value={bookingPage.date}
        onChange={bookingPage.setDate}
        minDate={dayjs().utc().toDate()}
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
        onClick={handleConfirmAndBook}
        disabled={
          createBookingMutation.isLoading ||
          bookingPage.checked.every((each) => !each)
        }
        fullWidth
        id="submitBookings"
      >
        Confirm & Book
      </Button>
    </SimpleGrid>
  );
}

export default BookingControl;
