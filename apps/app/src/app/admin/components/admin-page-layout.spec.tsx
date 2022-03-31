import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AdminPageLayout from './admin-page-layout';

describe('AdminPageLayout', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  beforeEach(cleanup);

  it('should render', () => {
    const container = render(<AdminPageLayout />, { wrapper });
    expect(container.baseElement).toBeTruthy();
  });

  it('should render breadcrumbs', () => {
    const container = render(<AdminPageLayout />, { wrapper });
    const breadcrumb = container.getByTestId('breadcrumb');
    expect(breadcrumb).toBeTruthy();
    const aInBreadCrumbs = breadcrumb.getElementsByTagName('a');
    expect(aInBreadCrumbs.length).toBe(1);
  });

  it('should render extra breadcrumbs', () => {
    render(
      <AdminPageLayout breadCrumbList={[{ title: 'Test', href: '/test' }]} />,
      { wrapper }
    );

    const breadcrumb = screen.queryByTestId('breadcrumb');

    const aInBreadCrumbs = breadcrumb.getElementsByTagName('a');

    expect(aInBreadCrumbs.length).toBe(2);

    expect(aInBreadCrumbs[1]).toHaveAttribute('href', '/test');

    expect(aInBreadCrumbs[1].innerHTML).toContain('Test');
  });

  it('should not render breadcrumbs', () => {
    render(<AdminPageLayout withBreadCrumb={false} />, { wrapper });
    const breadcrumb = screen.queryByTestId('breadcrumb');

    expect(breadcrumb).toBeNull();
  });
});
