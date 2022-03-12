import { render } from '@testing-library/react';

import BookingControl from './booking-control';

describe('BookingControl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookingControl />);
    expect(baseElement).toBeTruthy();
  });
});
