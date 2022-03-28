import { Space, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
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

export const SignUpPage = (props: SignUpPageProps) => {
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

  const handleSubmit = (values: typeof form['values']) => {
    console.log(values);
  };

  return (
    <AuthFormLayouts>
      <Text size="xl" weight={500} align="center">
        SIGN UP
      </Text>
      <Space h="sm" />
      <SignUpForm form={form} handleSubmit={handleSubmit} />
    </AuthFormLayouts>
  );
};

export default SignUpPage;
