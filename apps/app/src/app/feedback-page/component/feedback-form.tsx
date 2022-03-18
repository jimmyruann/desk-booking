import {
  Button,
  Group,
  NativeSelect,
  Textarea,
  TextInput,
} from '@mantine/core';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';

export interface FeedbackFormInputProps {
  type: string;
  title: string;
  message: string;
}

export interface FeedbackFormProps {
  form: UseForm<FeedbackFormInputProps>;
  handleSubmit: (values: FeedbackFormInputProps) => void;
}

export const FeedbackForm = ({ form, handleSubmit }: FeedbackFormProps) => {
  return (
    <form
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
      className="tw-py-8"
      name="feedbackForm"
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
