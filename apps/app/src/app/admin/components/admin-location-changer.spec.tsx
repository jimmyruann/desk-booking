import { cleanup, render } from '@testing-library/react';
import AdminLocationChanger from './admin-location-changer';

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
  {
    id: 2,
    locationId: 'test-location-2',
    displayName: 'Test Location 2',
    timeZone: 'UTC',
    mapUrl: '',
    capacity: 100,
    allowBookingFrom: 0,
    allowBookingTill: 1439,
  },
];

describe('AdminLocationChanger', () => {
  const changeCurrentLocationMock = jest.fn();

  beforeEach(cleanup);

  it('should render correctly', () => {
    const container = render(
      <AdminLocationChanger
        locations={mockLocations}
        currentLocation={mockLocations[0]}
        changeCurrentLocation={changeCurrentLocationMock}
      />
    );

    expect(container.baseElement).toBeTruthy();
  });
});
