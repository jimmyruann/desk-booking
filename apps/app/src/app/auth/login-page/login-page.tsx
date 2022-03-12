import './login-page.module.css';

import { LoginForm } from '@desk-booking/ui';
import { useAuth } from '../../../shared/context/Authentication';
import { useForm } from '@mantine/hooks';
import validator from 'validator';

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

  return <LoginForm form={form} handleLogin={handleLogin} />;
}

export default LoginPage;
