import { render } from '@testing-library/react';

import MyBookingTable from './my-booking-table';

describe('MyBookingTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyBookingTable />);
    expect(baseElement).toBeTruthy();
  });
});
