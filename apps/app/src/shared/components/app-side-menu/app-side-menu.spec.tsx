import { render } from '@testing-library/react';

import AppSideMenu from './app-side-menu';

describe('AppSideMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppSideMenu />);
    expect(baseElement).toBeTruthy();
  });
});
