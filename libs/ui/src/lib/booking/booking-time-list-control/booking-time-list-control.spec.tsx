import { render } from '@testing-library/react';

import BookingTimeListControl from './booking-time-list-control';

describe('BookingTimeListControl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookingTimeListControl />);
    expect(baseElement).toBeTruthy();
  });
});
