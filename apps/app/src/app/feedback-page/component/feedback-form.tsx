import {
  Button,
  Group,
  NativeSelect,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

export interface FeedbackFormInputProps {
  type: string;
  title: string;
  message: string;
}

export interface FeedbackFormProps {
  handleSubmit: (values: FeedbackFormInputProps) => void;
}

const feedbackFormSchema = z.object({
  type: z.string().min(1, { message: 'Feedback type must not be empty.' }),
  title: z.string().min(1, { message: 'Title must not be empty.' }),
  message: z.string().min(1, { message: 'Description must not be empty.' }),
});

export const FeedbackForm = ({ handleSubmit }: FeedbackFormProps) => {
  const form = useForm({
    schema: zodResolver(feedbackFormSchema),
    initialValues: {
      type: 'idea',
      title: '',
      message: '',
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        form.reset();
        handleSubmit(values);
      })}
      className="tw-py-8"
      name="feedbackForm"
      data-testid="feedbackForm"
    >
      <Group direction="column" grow>
        <NativeSelect
          data={[
            { value: 'idea', label: 'Idea' },
            { value: 'issue', label: 'Issues' },
          ]}
          placeholder="Feedback Type"
          label="Feedback Type"
          required
          name="feedbackType"
          {...form.getInputProps('type')}
        />

        <TextInput
          required
          label="Title"
          placeholder="Feedback Title"
          name="title"
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Description"
          required
          name="description"
          {...form.getInputProps('message')}
        />

        <Button type="submit" fullWidth>
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default FeedbackForm;
