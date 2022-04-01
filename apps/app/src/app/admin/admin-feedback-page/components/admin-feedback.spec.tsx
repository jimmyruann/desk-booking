import { cleanup, render, waitFor } from '@testing-library/react';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import testFeedback from '../__mocks__/feedback';
import AdminFeedback from './admin-feedback';

describe('AdminFeedback', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    cleanup();
    nock('http://localhost/api')
      .get(`/feedback/${testFeedback.id}`)
      .reply(200, testFeedback);
  });

  it('should render', async () => {
    const container = render(<AdminFeedback id={testFeedback.id} />, {
      wrapper,
    });

    await waitFor(() => container.getByTestId('feedbackValues'));

    expect(container.baseElement).toBeTruthy();
  });

  it('should render correct value', async () => {
    const container = render(<AdminFeedback id={testFeedback.id} />, {
      wrapper,
    });

    await waitFor(() => container.getByTestId('feedbackValues'));

    const feedbackValueContainer = container.getByTestId('feedbackValues');
    expect(feedbackValueContainer.innerHTML).toContain(testFeedback.message);
  });
});
