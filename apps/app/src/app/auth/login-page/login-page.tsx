import { Space, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../../shared/context/Authentication.context';
import AuthFormLayouts from '../components/auth-form-layout';
import { LoginCred, LoginForm } from './components/login-form';

const formSchema = z.object({
  email: z.string().email('Email is not valid'),
  password: z.string(),
});

export function LoginPage() {
  const auth = useAuth();
  const form = useForm({
    schema: zodResolver(formSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = (loginCred: LoginCred) => {
    auth.login.mutate(loginCred, {
      onError: (error) => {
        form.reset();
        form.setFieldError(
          'email',
          error.response.data.message ||
            error.message ||
            'Something went wrong.'
        );
      },
    });
  };

  return (
    <AuthFormLayouts>
      <Text size="xl" weight={500} align="center">
        DESK BOOKING SERVICE
      </Text>
      <Space h="sm" />
      <LoginForm
        form={form}
        handleLogin={handleLogin}
        status={auth.login.status}
      />
      <Space h="lg" />
      <Text align="center" color="gray">
        Don't have a account? <Link to="/auth/signup">Sign Up</Link>
      </Text>
    </AuthFormLayouts>
  );
}

export default LoginPage;
