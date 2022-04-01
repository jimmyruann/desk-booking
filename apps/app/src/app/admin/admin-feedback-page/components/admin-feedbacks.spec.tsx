import { cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as reactRouter from 'react-router';
import { MemoryRouter } from 'react-router';
import testFeedbacks from '../__mocks__/feedbackList';
import AdminFeedbacks from './admin-feedbacks';

describe('AdminFeedbacks', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  beforeEach(() => {
    cleanup();
    nock('http://localhost/api')
      .get(`/feedback/list`)
      .reply(200, testFeedbacks);
  });

  it('should render', async () => {
    const container = render(<AdminFeedbacks />, {
      wrapper,
    });
    await waitFor(() => container.getByTestId('feedbackValues'));
    expect(container.baseElement).toBeTruthy();

    expect(container.getByTestId('feedbackValuesTBody').children.length).toBe(
      testFeedbacks.length
    );
  });

  it('should redirect when clicked on feedback row', async () => {
    const mockFn = jest.fn();
    jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockFn);

    const container = render(<AdminFeedbacks />, {
      wrapper,
    });

    await waitFor(() => container.getByTestId('feedbackValues'));

    const feedbackValuesTBody = container.getByTestId('feedbackValuesTBody');

    await userEvent.click(feedbackValuesTBody.children[0]);

    expect(mockFn).toBeCalledWith(testFeedbacks[0].id.toString());
  });
});
