import { Space, Text } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import validator from 'validator';
import { useAuth } from '../../../shared/context/Authentication';
import AuthFormLayouts from '../components/AuthFormLayouts';
import { LoginForm } from './components/login-form';

/* eslint-disable-next-line */
export interface LoginPageProps {}

export function LoginPage(props: LoginPageProps) {
  const auth = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: (value) => validator.isEmail(value),
      password: (value) => !validator.isEmpty(value),
    },
    errorMessages: {
      email: 'Email is not valid',
      password: 'Password is required.',
    },
  });

  const handleLogin = async (loginCred: typeof form['values']) => {
    const [data, err] = await auth.login(loginCred);
    if (!data && err) {
      form.setFieldError('email', err);
      form.setValues({
        email: loginCred.email,
        password: '',
      });
    }
  };

  return (
    <AuthFormLayouts>
      <Text size="xl" weight={500} align="center">
        DESK BOOKING SERVICE
      </Text>
      <Space h="sm" />
      <LoginForm form={form} handleLogin={handleLogin} />
      <Space h="lg" />
      <Text align="center" color="gray">
        Don't have a account? <Link to="/auth/signup">Sign Up</Link>
      </Text>
    </AuthFormLayouts>
  );
}

export default LoginPage;
