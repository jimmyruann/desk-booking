import { NotificationsProvider } from '@mantine/notifications';
import { cleanup, render, waitFor } from '@testing-library/react';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from 'react-query';
import AdminAreaSettingsForm from './admin-area-settings-form';

const mockLocations = [
  {
    id: 1,
    locationId: 'test-location',
    displayName: 'Test Location',
    timeZone: 'UTC',
    mapUrl: '',
    capacity: 100,
    allowBookingFrom: 0,
    allowBookingTill: 1439,
  },
];

describe('AdminAreaSettingsForm', () => {
  beforeEach(cleanup);
  const htmlIdTest = 'test-desk-1';
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>{children}</NotificationsProvider>
    </QueryClientProvider>
  );

  beforeEach(() => {
    cleanup();

    nock('http://localhost/api')
      .get('/area-types')
      .reply(200, [
        {
          id: 1,
          name: 'desk',
          interval: 3600000,
        },
        {
          id: 2,
          name: 'room',
          interval: 900000,
        },
      ])
      .get(`/areas/${htmlIdTest}`)
      .reply(200, {
        id: 1,
        htmlId: htmlIdTest,
        displayName: 'Test Desk 1',
        locationId: '1',
        areaTypeId: '1',
        allowBooking: true,
      });
  });

  it('should render correctly', async () => {
    const container = render(
      <AdminAreaSettingsForm
        htmlId={htmlIdTest}
        locations={mockLocations}
        currentLocation={mockLocations[0]}
      />,
      {
        wrapper,
      }
    );

    await waitFor(() => container.getByTestId('adminAreaSettingsForm'));

    expect(container.baseElement).toBeTruthy();
    expect(
      container.baseElement.querySelector('input[name=htmlId]')
    ).toHaveAttribute('value', htmlIdTest);
  });
});
