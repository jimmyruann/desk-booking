import {
  Button,
  createStyles,
  Group,
  InputWrapper,
  LoadingOverlay,
  PasswordInput,
  Space,
  TextInput,
} from '@mantine/core';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';
import { useState } from 'react';
import { HiFingerPrint, HiLockClosed, HiOutlineLogin } from 'react-icons/hi';

/* eslint-disable-next-line */
interface LoginCred {
  email: string;
  password: string;
}

export interface LoginFormProps {
  handleLogin: (loginCred: LoginCred) => void;
  form: UseForm<LoginCred>;
}

const useStyles = createStyles((theme) => ({
  input: {
    width: '100%',
  },
}));

export function LoginForm({ form, handleLogin }: LoginFormProps) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (loginCred: typeof form['values']) => {
    setLoading(true);
    setTimeout(() => {
      handleLogin(loginCred);
      setLoading(false);
    }, 1500);
  };

  return (
    <form
      onSubmit={form.onSubmit(handleFormSubmit)}
      style={{ position: 'relative' }}
      name="loginForm"
    >
      <LoadingOverlay visible={loading} />
      <Group position="center" direction="column" spacing="xs">
        <InputWrapper required label="Email" className={classes.input}>
          <TextInput
            icon={<HiFingerPrint size={18} />}
            placeholder="Email"
            type="email"
            name="email"
            required
            {...form.getInputProps('email')}
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
        <Space />
        <Button
          uppercase
          leftIcon={<HiOutlineLogin size={18} />}
          fullWidth
          type="submit"
        >
          Login
        </Button>
      </Group>
    </form>
  );
}

export default LoginForm;
