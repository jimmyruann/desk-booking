import { CreateFeedbackDto, CreateFeedbackReturn } from '@desk-booking/data';
import { createStyles } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import validator from 'validator';
import { useApi } from '../../shared/context/ApiClient';
import FeedbackForm from './component/feedback-form';
import FeedbackHeader from './component/feedback-header';

const useStyles = createStyles((theme) => ({
  common: {
    backgroundColor: theme.white,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.md,
    width: '100%',
    maxWidth: 600,
    marginInline: 'auto',
  },
}));

/* eslint-disable-next-line */
export interface FeedbackPageProps {}

export function FeedbackPage(props: FeedbackPageProps) {
  const { classes } = useStyles();
  const api = useApi();
  const notifications = useNotifications();
  const form = useForm({
    initialValues: {
      type: 'idea',
      title: '',
      message: '',
    },

    validationRules: {
      type: (value) => !validator.isEmpty(value),
      title: (value) => !validator.isEmpty(value),
      message: (value) => !validator.isEmpty(value),
    },

    errorMessages: {
      type: 'Feedback type must not be empty.',
      title: 'Title must not be empty.',
      message: 'Description must not be empty.',
    },
  });

  const feedbackMutation = useMutation(
    (data: CreateFeedbackDto) => {
      return api.client.post<CreateFeedbackReturn>('/feedback', data);
    },
    {
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
      onMutate: () => {
        form.reset();
      },
    }
  );

  return (
    <div className={classes.common}>
      <FeedbackHeader />
      <FeedbackForm
        form={form}
        handleSubmit={(values) => feedbackMutation.mutate(values)}
      />
    </div>
  );
}

export default FeedbackPage;
