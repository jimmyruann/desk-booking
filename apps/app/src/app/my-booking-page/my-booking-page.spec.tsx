import { render } from '@testing-library/react';

import MyBookingPage from './my-booking-page';

describe('MyBookingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyBookingPage />);
    expect(baseElement).toBeTruthy();
  });
});
