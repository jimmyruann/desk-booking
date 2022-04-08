import {
  Button,
  Group,
  InputWrapper,
  Loader,
  PasswordInput,
  Space,
  TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { HiFingerPrint, HiLockClosed, HiOutlineLogin } from 'react-icons/hi';

export interface LoginCred {
  email: string;
  password: string;
}

export interface LoginFormProps {
  handleLogin: (loginCred: LoginCred) => void;
  form: UseFormReturnType<LoginCred>;
  status: 'error' | 'loading' | 'success' | 'idle';
}

export function LoginForm({ form, handleLogin, status }: LoginFormProps) {
  return (
    <form
      onSubmit={form.onSubmit((loginCred) => handleLogin(loginCred))}
      style={{ position: 'relative' }}
      name="loginForm"
      data-testid="loginForm"
    >
      <Group position="center" direction="column" spacing="xs">
        <InputWrapper
          required
          label="Email"
          sx={() => ({
            width: '100%',
          })}
        >
          <TextInput
            icon={<HiFingerPrint size={18} />}
            placeholder="Email"
            type="email"
            name="email"
            required
            {...form.getInputProps('email')}
          />
        </InputWrapper>
        <InputWrapper
          required
          label="Password"
          sx={() => ({
            width: '100%',
          })}
        >
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
          disabled={status === 'loading'}
        >
          {status === 'loading' ? <Loader color="orange" /> : <>Login</>}
        </Button>
      </Group>
    </form>
  );
}

export default LoginForm;
