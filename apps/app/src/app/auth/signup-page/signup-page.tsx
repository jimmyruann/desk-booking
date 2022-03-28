import { SignupUserDto, UserEntity } from '@desk-booking/data';
import { LoadingOverlay, Space, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { axiosApiClient } from '../../../shared/api/api';
import AuthFormLayouts from '../components/AuthFormLayouts';
import SignUpForm from './components/signup-form';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SignUpPageProps {}

export const signUpFormSchema = z
  .object({
    email: z
      .string()
      .email()
      .regex(new RegExp(/@dynatrace.com/g), {
        message: 'Dynatrace emails only.',
      }),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

const createUser = async (values: SignupUserDto) => {
  const { data } = await axiosApiClient.post<UserEntity>(
    '/auth/signup',
    values,
    {
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig
  );

  return data;
};

export const SignUpPage = (props: SignUpPageProps) => {
  const notifications = useNotifications();
  const navigation = useNavigate();
  const [userCreated, setUserCreated] = useState(false);

  const form = useForm({
    schema: zodResolver(signUpFormSchema),
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const createUserMutation = useMutation(
    (values: SignupUserDto) => createUser(values),
    {
      onSuccess: () => {
        form.reset();
        setUserCreated(true);
        notifications.showNotification({
          color: 'green',
          title: 'Success',
          message: 'Your account was created.',
        });
        setTimeout(() => {
          navigation('/auth/login');
        }, 3000);
      },
      onError: (error: AxiosError, values) => {
        const errorMessage =
          error.response.data.message ||
          error.message ||
          'Something went wrong.';

        form.setValues({
          ...values,
          password: '',
          confirmPassword: '',
        });

        form.setFieldError('email', errorMessage);

        notifications.showNotification({
          color: 'red',
          title: 'Unable to create account',
          message: errorMessage,
        });
      },
    }
  );

  const handleSubmit = (values: typeof form['values']) => {
    createUserMutation.mutate(values);
  };

  const success = (
    <div>
      <Text>Redirecting you to login page...</Text>
      <Text>
        Click <Link to="/auth/login">here</Link> if you were not redirected in 5
        seconds.
      </Text>
    </div>
  );

  return (
    <AuthFormLayouts>
      <Text size="xl" weight={500} align="center">
        SIGN UP
      </Text>
      <Space h="sm" />
      {userCreated ? (
        success
      ) : (
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={createUserMutation.isLoading} />
          <SignUpForm form={form} handleSubmit={handleSubmit} />
        </div>
      )}
    </AuthFormLayouts>
  );
};

export default SignUpPage;
