import { render } from '@testing-library/react';

import BookingPage from './booking-page';

describe('BookingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookingPage />);
    expect(baseElement).toBeTruthy();
  });
});
