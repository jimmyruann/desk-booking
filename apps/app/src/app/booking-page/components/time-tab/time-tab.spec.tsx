import { render } from '@testing-library/react';

import TimeTab from './time-tab';

describe('TimeTab', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimeTab />);
    expect(baseElement).toBeTruthy();
  });
});
