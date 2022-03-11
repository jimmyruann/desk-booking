import { render } from '@testing-library/react';

import MapBox from './map-box';

describe('MapBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapBox />);
    expect(baseElement).toBeTruthy();
  });
});
