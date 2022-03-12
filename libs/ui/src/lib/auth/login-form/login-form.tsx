import {
  Button,
  Card,
  Container,
  createStyles,
  Group,
  InputWrapper,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';

import { HiFingerPrint, HiLockClosed, HiOutlineLogin } from 'react-icons/hi';
import './login-form.module.css';
import { useState } from 'react';
import { UseForm } from '@mantine/hooks/lib/use-form/use-form';

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
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '400px',
  },
  input: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.md,
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
    <Container className={classes.container}>
      <Card shadow="sm" padding="xl" withBorder className={classes.card}>
        <Text size="xl" weight={400} align="center">
          DESK BOOKING SERVICE
        </Text>
        <br />
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
            <Button
              uppercase
              leftIcon={<HiOutlineLogin size={18} />}
              fullWidth
              type="submit"
              className={classes.button}
            >
              Login
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}

export default LoginForm;
