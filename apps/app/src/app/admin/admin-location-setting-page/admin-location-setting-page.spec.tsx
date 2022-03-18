import { render } from '@testing-library/react';

import AdminLocationSettingPage from './admin-location-setting-page';

describe('AdminLocationSettingPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminLocationSettingPage />);
    expect(baseElement).toBeTruthy();
  });
});
