import { render } from '@testing-library/react';
import SignUpPage from './signup-page';

describe('SignUpPage', () => {
  it('should render', () => {
    const { baseElement } = render(<SignUpPage />);
    expect(baseElement).toBeTruthy();
  });
});
