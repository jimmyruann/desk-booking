import { render } from '@testing-library/react';

import AppSideMenuItem from './app-side-menu-item';

describe('AppSideMenuItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppSideMenuItem />);
    expect(baseElement).toBeTruthy();
  });
});
