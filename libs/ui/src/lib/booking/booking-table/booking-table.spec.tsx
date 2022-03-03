import { render } from '@testing-library/react';

import BookingTable from './booking-table';

describe('BookingTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BookingTable />);
    expect(baseElement).toBeTruthy();
  });
});
