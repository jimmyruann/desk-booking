import { cleanup, render } from '@testing-library/react';
import MapBoxSkeleton from './map-skeleton';

describe('MapSkeleton Component', () => {
  beforeEach(cleanup);
  it('should render', () => {
    const { baseElement } = render(<MapBoxSkeleton />);

    expect(baseElement).toBeTruthy();
  });
});
