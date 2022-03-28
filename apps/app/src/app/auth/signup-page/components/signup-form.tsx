import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  Button,
  createStyles,
  Group,
  InputWrapper,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import React from 'react';
import { HiLockClosed, HiMail, HiOutlineLogin, HiUser } from 'react-icons/hi';
import { environment } from '../../../../environments/environment';

export interface SignUpFormValueProps {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  hCaptchaToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SignUpFormProps extends React.HTMLAttributes<HTMLFormElement> {
  form: UseFormReturnType<SignUpFormValueProps>;
  handleSubmit: (values: SignUpFormValueProps) => void;
  hCaptchaRef?: React.MutableRefObject<HCaptcha>;
}

const useStyles = createStyles((theme) => ({
  input: {
    width: '100%',
  },
}));

export const SignUpForm = React.forwardRef<HTMLFormElement, SignUpFormProps>(
  ({ form, handleSubmit, hCaptchaRef, ...props }, ref) => {
    const { classes } = useStyles();
    return (
      <form
        data-testid="signup-form"
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        ref={ref}
        {...props}
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

          <InputWrapper {...form.getInputProps('hCaptchaToken')}>
            <HCaptcha
              sitekey={environment.hCaptchaSiteKey}
              onVerify={(token) => form.setFieldValue('hCaptchaToken', token)}
              ref={hCaptchaRef}
            />
          </InputWrapper>

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
  }
);

export default SignUpForm;
