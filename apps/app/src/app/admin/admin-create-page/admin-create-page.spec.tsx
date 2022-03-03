import { render } from '@testing-library/react';

import AdminCreatePage from './admin-create-page';

describe('AdminCreatePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminCreatePage />);
    expect(baseElement).toBeTruthy();
  });
});
