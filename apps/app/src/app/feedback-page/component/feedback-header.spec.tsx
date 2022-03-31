import { cleanup, render } from '@testing-library/react';
import FeedbackHeader from './feedback-header';
describe('FeedbackHeader', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const container = render(<FeedbackHeader />);

    expect(container.baseElement).toBeTruthy();
    expect(container.baseElement.innerHTML).toContain('We need feedbacks');
  });
});
