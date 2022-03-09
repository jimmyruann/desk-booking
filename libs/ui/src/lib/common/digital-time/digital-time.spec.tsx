import { render } from '@testing-library/react';

import DigitalTime from './digital-time';

describe('DigitalTime', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DigitalTime />);
    expect(baseElement).toBeTruthy();
  });
});
