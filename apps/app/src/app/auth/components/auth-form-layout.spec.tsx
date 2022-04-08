import { cleanup, render } from '@testing-library/react';
import AuthFormLayouts from './auth-form-layout';
describe('AuthFormLayouts', () => {
  beforeEach(cleanup);

  it('should be able to render', () => {
    const container = render(
      <AuthFormLayouts>
        <div data-testid="testId">Hello</div>
      </AuthFormLayouts>
    );

    expect(container.baseElement).toBeTruthy();
    expect(container.getByTestId('testId')).toBeTruthy();
  });
});
