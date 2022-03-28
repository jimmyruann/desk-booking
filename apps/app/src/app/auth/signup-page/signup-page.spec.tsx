import { NotificationsProvider } from '@mantine/notifications';
import { cleanup, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { MemoryRouter } from 'react-router';
import SignUpPage from './signup-page';

setLogger({
  log: console.log,
  warn: console.warn,
  // ✅ no more errors on the console
  error: () => null,
});

describe('SignUpPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>{children}</NotificationsProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  beforeEach(cleanup);

  it('should render', () => {
    const mockedUsedNavigate = jest.fn();

    jest.mock('react-router-dom', () => ({
      ...(jest.requireActual('react-router-dom') as any),
      useNavigate: () => mockedUsedNavigate,
    }));

    const { baseElement } = render(<SignUpPage />, {
      wrapper,
    });

    expect(baseElement).toBeTruthy();
  });
});
