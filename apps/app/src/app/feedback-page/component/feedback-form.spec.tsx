import { cleanup, render } from '@testing-library/react';
import FeedbackForm from './feedback-form';

describe('FeedbackForm', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const handleSubmitMock = jest.fn();

    const container = render(<FeedbackForm handleSubmit={handleSubmitMock} />);

    expect(container.baseElement).toBeTruthy();
    expect(container.getByTestId('feedbackForm')).toBeTruthy();
  });
});
