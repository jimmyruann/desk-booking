import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AdminPage from './admin-page';
describe('AdminPage', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const container = render(<AdminPage />, {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    expect(container.baseElement).toBeTruthy();
  });
});
