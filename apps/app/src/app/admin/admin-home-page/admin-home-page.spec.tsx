import { render } from '@testing-library/react';

import AdminHomePage from './admin-home-page';

describe('AdminHomePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminHomePage />);
    expect(baseElement).toBeTruthy();
  });
});
