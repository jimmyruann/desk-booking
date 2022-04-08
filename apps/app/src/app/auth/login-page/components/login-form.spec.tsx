import { useForm } from '@mantine/form';
import { cleanup, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import LoginForm, { LoginCred } from './login-form';

describe('LoginForm', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const form = renderHook(() =>
      useForm<LoginCred>({
        initialValues: {
          email: '',
          password: '',
        },
      })
    );
    const handleLoginMock = jest.fn();

    const container = render(
      <LoginForm
        status="idle"
        form={form.result.current}
        handleLogin={handleLoginMock}
      />
    );

    expect(container.getByTestId('loginForm')).toBeTruthy();
  });

  // it('should be able to submit', async () => {
  //   const mockData = {
  //     email: faker.internet.email(),
  //     password: 'password',
  //   };

  //   const { result, waitForNextUpdate } = renderHook(() =>
  //     useForm<LoginCred>({
  //       initialValues: mockData,
  //     })
  //   );

  //   const handleLoginMock = jest.fn();

  //   const { container } = render(
  //     <LoginForm form={result.current} handleLogin={handleLoginMock} />
  //   );

  //   userEvent.click(container.querySelector('button[type=submit]'));

  //   await waitForNextUpdate({
  //     timeout: 2000,
  //   });

  //   expect(handleLoginMock).toBeCalled();
  // });
});
