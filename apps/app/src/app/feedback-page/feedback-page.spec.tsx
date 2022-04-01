import { NotificationsProvider } from '@mantine/notifications';
import { cleanup, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import FeedbackPage from './feedback-page';

describe('FeedbackPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>{children}</NotificationsProvider>
    </QueryClientProvider>
  );

  beforeEach(cleanup);

  it('should render', () => {
    const container = render(<FeedbackPage />, {
      wrapper,
    });

    expect(container.baseElement).toBeTruthy();
    expect(container.getByTestId('feedbackForm')).toBeTruthy();
  });
});
