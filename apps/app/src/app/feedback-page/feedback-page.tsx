import { FeedbackEntity } from '@desk-booking/data';
import { Paper } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { axiosApiClient } from '../../shared/api';
import FeedbackForm, {
  FeedbackFormInputProps,
} from './component/feedback-form';
import FeedbackHeader from './component/feedback-header';

const createFeedback = async (values: FeedbackFormInputProps) => {
  const { data } = await axiosApiClient.post<FeedbackEntity>(
    '/feedback',
    values
  );
  return data;
};

export const FeedbackPage = () => {
  const notifications = useNotifications();

  const feedbackMutation = useMutation(createFeedback, {
    onSuccess: () => {
      notifications.showNotification({
        color: 'green',
        title: 'We received your feedback',
        message: 'Thank you for your feedback. ',
      });
    },
    onError: (error: AxiosError) => {
      notifications.showNotification({
        color: 'red',
        title: 'Something went wrong',
        message: error.response.data.message || error.message,
      });
    },
  });

  return (
    <Paper
      shadow="xs"
      p="xl"
      sx={() => ({
        width: '100%',
        maxWidth: 600,
        marginInline: 'auto',
      })}
    >
      <FeedbackHeader />
      <FeedbackForm
        handleSubmit={(values) => feedbackMutation.mutate(values)}
      />
    </Paper>
  );
};

export default FeedbackPage;
