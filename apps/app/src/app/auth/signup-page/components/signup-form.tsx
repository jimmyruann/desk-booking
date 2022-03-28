import {
  Button,
  createStyles,
  Group,
  InputWrapper,
  PasswordInput,
  Space,
  TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { HiLockClosed, HiMail, HiOutlineLogin, HiUser } from 'react-icons/hi';

export interface SignUpFormValueProps {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SignUpFormProps {
  form: UseFormReturnType<SignUpFormValueProps>;
  handleSubmit: (values: SignUpFormValueProps) => void;
}

const useStyles = createStyles((theme) => ({
  input: {
    width: '100%',
  },
}));

export const SignUpForm = ({
  form,
  handleSubmit,
  ...props
}: SignUpFormProps) => {
  const { classes } = useStyles();
  return (
    <form
      onSubmit={form.onSubmit((values) => handleSubmit(values))}
      {...props}
      data-testid="signup-form"
    >
      <Group position="center" direction="column" spacing="xs">
        <InputWrapper required label="Email" className={classes.input}>
          <TextInput
            icon={<HiMail size={18} />}
            placeholder="john.smith@dynatrace.com"
            type="email"
            name="email"
            required
            {...form.getInputProps('email')}
          />
        </InputWrapper>
        <InputWrapper required label="First name" className={classes.input}>
          <TextInput
            icon={<HiUser size={18} />}
            placeholder="John"
            type="text"
            name="firstName"
            required
            {...form.getInputProps('firstName')}
          />
        </InputWrapper>
        <InputWrapper required label="Last name" className={classes.input}>
          <TextInput
            icon={<HiUser size={18} />}
            placeholder="Smith"
            type="text"
            name="lastName"
            required
            {...form.getInputProps('lastName')}
          />
        </InputWrapper>
        <InputWrapper required label="Password" className={classes.input}>
          <PasswordInput
            icon={<HiLockClosed size={18} />}
            placeholder="Password"
            required
            name="password"
            {...form.getInputProps('password')}
          />
        </InputWrapper>
        <InputWrapper
          required
          label="Confirm Password"
          className={classes.input}
        >
          <PasswordInput
            icon={<HiLockClosed size={18} />}
            placeholder="Confirm Password"
            required
            name="confirmPassword"
            {...form.getInputProps('confirmPassword')}
          />
        </InputWrapper>
        <Space />
        <Button
          uppercase
          leftIcon={<HiOutlineLogin size={18} />}
          fullWidth
          type="submit"
        >
          Create Account
        </Button>
      </Group>
    </form>
  );
};

export default SignUpForm;
