import { cleanup, render } from '@testing-library/react';
import App from './app';
describe('App', () => {
  beforeEach(cleanup);

  it('should render', () => {
    const container = render(<App />);
    expect(container.baseElement).toBeTruthy();
  });
});
