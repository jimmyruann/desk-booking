import { cleanup, render, screen, waitFor } from '@testing-library/react';
import nock from 'nock';
import { act } from 'react-dom/test-utils';
import Map from './map';

describe('Map Component', () => {
  const mockSvgUrl = '/test.svg';
  const mockSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z" /> </svg>`;
  const mockMapAreaChildren = [
    {
      name: 'path',
      type: 'element',
      value: '',
      attributes: {
        d: 'M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z',
        id: 'test-desk-1',
        'data-testid': 'test-desk-1',
      },
      children: [],
    },
  ];

  beforeEach(cleanup);

  it('should render', async () => {
    const mockHtmlSetState = jest.fn();

    nock('http://localhost').get(mockSvgUrl).reply(200, mockSvg);

    const { container } = render(
      <Map htmlIdHook={['', mockHtmlSetState]} mapUrl={mockSvgUrl} />
    );

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    );

    expect(
      container.innerHTML.includes(`http://www.w3.org/2000/svg`)
    ).toBeTruthy();
  });

  it('should render with mapJson', async () => {
    const mockHtmlIdHook = jest.fn().mockImplementation(() => {
      return ['', (htmlId: string) => null];
    });

    nock('http://localhost').get(mockSvgUrl).reply(200, mockSvg);

    const { container } = render(
      <Map
        htmlIdHook={mockHtmlIdHook()}
        mapUrl={mockSvgUrl}
        mapAreaChildren={mockMapAreaChildren}
      />
    );
    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    );

    expect(screen.getByTestId('test-desk-1')).toBeTruthy();
  });

  it('should call htmlId hook when clicked', async () => {
    const mockHtmlSetState = jest.fn();

    nock('http://localhost').get(mockSvgUrl).reply(200, mockSvg);

    const { container } = render(
      <Map
        htmlIdHook={['', mockHtmlSetState]}
        mapUrl={mockSvgUrl}
        mapAreaChildren={mockMapAreaChildren}
      />
    );
    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    );

    const testDesk1Container = screen.getByTestId('test-desk-1');

    expect(testDesk1Container).toBeTruthy();

    act(() => {
      testDesk1Container.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    });

    expect(mockHtmlSetState).toBeCalledWith('test-desk-1');
  });
});
