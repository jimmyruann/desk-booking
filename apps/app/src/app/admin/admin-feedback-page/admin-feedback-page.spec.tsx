import { cleanup, render, waitFor } from '@testing-library/react';
import nock from 'nock';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import AdminFeedbackPage from './admin-feedback-page';
import testFeedback from './__mocks__/feedback';
import testFeedbacks from './__mocks__/feedbackList';

describe('AdminFeedbackPage', () => {
  beforeEach(() => {
    cleanup();
    nock('http://localhost/api')
      .get(`/feedback/list`)
      .reply(200, testFeedbacks)
      .get(`/feedback/${testFeedback.id}`)
      .reply(200, testFeedback);
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should render many feedbacks', async () => {
    const container = render(
      <MemoryRouter>
        <AdminFeedbackPage />
      </MemoryRouter>,
      { wrapper }
    );
    await waitFor(() => container.getByTestId('feedbackValues'));

    expect(container.baseElement).toBeTruthy();
    expect(container.getByTestId('feedbackValuesTBody').children.length).toBe(
      testFeedbacks.length
    );
  });

  it('should render single feedback', async () => {
    const container = render(
      <MemoryRouter initialEntries={['/feedbacks/1']}>
        <Routes>
          <Route path="/feedbacks/:id" element={<AdminFeedbackPage />} />
        </Routes>
      </MemoryRouter>,
      {
        wrapper,
      }
    );
    await waitFor(() => container.getByTestId('feedbackValues'));

    const feedbackValueContainer = container.getByTestId('feedbackValues');
    expect(feedbackValueContainer.innerHTML).toContain(testFeedback.message);
  });
});
