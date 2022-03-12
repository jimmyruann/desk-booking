import { render } from '@testing-library/react';

import BookingTimeListItem from './booking-time-list-item';

describe('BookingTimeListItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookingTimeListItem />);
    expect(baseElement).toBeTruthy();
  });
});
