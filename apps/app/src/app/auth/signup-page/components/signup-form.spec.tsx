import { useForm, zodResolver } from '@mantine/form';
import { cleanup, render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { signUpFormSchema } from '../signup-page';
import SignUpForm, { SignUpFormValueProps } from './signup-form';

describe('SignUpForm', () => {
  beforeEach(cleanup);
  it('should render', () => {
    const handleSubmit = jest.fn();
    const form = renderHook(() =>
      useForm<SignUpFormValueProps>({
        initialValues: {
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
        },
      })
    );

    const { baseElement } = render(
      <SignUpForm handleSubmit={handleSubmit} form={form.result.current} />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should be able to submit', () => {
    const values = {
      email: 'test.test@dynatrace.com',
      firstName: 'Test',
      lastName: 'Test',
      password: 'test1234567',
      confirmPassword: 'test1234567',
    };
    const handleSubmit = jest.fn();
    const form = renderHook(() =>
      useForm<SignUpFormValueProps>({
        schema: zodResolver(signUpFormSchema),
        initialValues: values,
      })
    );

    const container = render(
      <SignUpForm handleSubmit={handleSubmit} form={form.result.current} />
    );

    act(() => {
      container
        .queryByTestId('signup-form')
        .querySelector('button[type=submit]')
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleSubmit).toBeCalledWith(values);
  });
});
