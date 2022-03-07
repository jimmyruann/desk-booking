import { useApi } from '@app/src/shared/context/ApiClient';
import { CreateFeedbackDto, CreateFeedbackReturn } from '@desk-booking/data';
import {
  Button,
  Group,
  NativeSelect,
  Textarea,
  Title,
  Text,
  createStyles,
  TextInput,
  Space,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import validator from 'validator';
import './feedback-page.module.css';

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
    }
  );

  const handleOnSubmit = (values: typeof form['values']) => {
    form.reset();
    feedbackMutation.mutate(values);
  };

  return (
    <div className={classes.common}>
      <Group direction="column">
        <Title order={3}>We need feedbacks</Title>
        <Text size="md">
          Your feedback is needed for us to continue improving the application.
        </Text>
      </Group>
      <Space h="md" />
      <form
        onSubmit={form.onSubmit((values) => handleOnSubmit(values))}
        className="tw-py-8"
      >
        <Group direction="column" grow={true}>
          <NativeSelect
            data={[
              { value: 'idea', label: 'Idea' },
              { value: 'issue', label: 'Issues' },
            ]}
            placeholder="Feedback Type"
            label="Feedback Type"
            required
            {...form.getInputProps('type')}
          />

          <TextInput
            required
            label="Title"
            placeholder="Feedback Title"
            {...form.getInputProps('title')}
          />

          <Textarea
            label="Description"
            required
            {...form.getInputProps('message')}
          />

          <Button type="submit" fullWidth>
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
}

export default FeedbackPage;
