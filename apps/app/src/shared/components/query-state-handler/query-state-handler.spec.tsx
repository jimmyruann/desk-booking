import { render } from '@testing-library/react';

import QueryStateHandler from './query-state-handler';

describe('QueryStateHandler', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryStateHandler />);
    expect(baseElement).toBeTruthy();
  });
});
