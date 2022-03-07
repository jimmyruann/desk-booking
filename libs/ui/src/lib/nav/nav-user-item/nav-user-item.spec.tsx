import { render } from '@testing-library/react';

import NavUserItem from './nav-user-item';

describe('NavUserItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavUserItem />);
    expect(baseElement).toBeTruthy();
  });
});
