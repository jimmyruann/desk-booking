import { render } from '@testing-library/react';

import PeopleTab from './people-tab';

describe('PeopleTab', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PeopleTab />);
    expect(baseElement).toBeTruthy();
  });
});
