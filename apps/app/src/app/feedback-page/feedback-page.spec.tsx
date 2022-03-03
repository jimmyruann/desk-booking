import { render } from '@testing-library/react';

import FeedbackPage from './feedback-page';

describe('FeedbackPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeedbackPage />);
    expect(baseElement).toBeTruthy();
  });
});
