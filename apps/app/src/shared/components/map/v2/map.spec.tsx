import { cleanup, render, screen, waitFor } from '@testing-library/react';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import Map from './map';

describe('Map', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    nock('http://localhost')
      .get('/assets/floorplan/test.svg')
      .reply(
        200,
        `
        <svg height="210" width="400">
            <g id="base">
                <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
            </g>
            <g id="areas">
                <path d="M150 0 L75 200 L225 200 Z" id="test-desk-1" data-testid="testDesk1"/>
            </g>
        </svg>
        `
      );
    cleanup();
  });

  it('should render correctly', async () => {
    const useHtml = () => ['', jest.fn()];
    const container = render(<Map locationId={'test'} useHtmlId={useHtml} />, {
      wrapper,
    });

    await waitFor(() => screen.getByTestId('testDesk1'));

    expect(container.baseElement).toBeTruthy();
  });
});
