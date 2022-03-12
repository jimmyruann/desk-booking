import { render } from '@testing-library/react';

import BookingTimeList from './booking-time-list';

describe('BookingTimeList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookingTimeList />);
    expect(baseElement).toBeTruthy();
  });
});
