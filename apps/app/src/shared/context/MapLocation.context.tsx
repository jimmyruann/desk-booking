import { LocationEntity } from '@desk-booking/data';
import { useUncontrolled } from '@mantine/hooks';
import ms from 'ms';
import React from 'react';
import { useQuery } from 'react-query';
import { axiosApiClient } from '../api';
import Loading from '../components/loading/loading';

interface MapLocationContext {
  currentLocation: LocationEntity;
  changeCurrentLocation: (locationId: string) => void;
  locations: LocationEntity[];
  findLocation: (locationId: string) => LocationEntity;
}

const MapLocationContext = React.createContext<MapLocationContext>(null);

interface MapLocationProviderProps {
  children: React.ReactNode;
  locations: LocationEntity[];
  currentLocation?: LocationEntity;
  defaultCurrentLocation?: LocationEntity;
  onChangeCurrentLocation?: (location: LocationEntity) => void;
}

export const MapLocationProvider = ({
  children,
  locations,
  currentLocation,
  defaultCurrentLocation,
  onChangeCurrentLocation,
}: MapLocationProviderProps) => {
  const [_currentLocation, handleCurrentLocationChange] = useUncontrolled({
    value: currentLocation,
    defaultValue: defaultCurrentLocation,
    finalValue: locations[0],
    rule: (val) => typeof val === 'object',
    onChange: onChangeCurrentLocation,
  });

  const findLocation = (locationId: string) => {
    return locations.find((location) => location.locationId === locationId);
  };

  return (
    <MapLocationContext.Provider
      value={{
        currentLocation: _currentLocation,
        locations,
        findLocation,
        changeCurrentLocation: (locationId) =>
          handleCurrentLocationChange(findLocation(locationId)),
      }}
    >
      {children}
    </MapLocationContext.Provider>
  );
};

export const useMapLocation = () => React.useContext(MapLocationContext);

const getLocations = async () => {
  const { data } = await axiosApiClient.get<LocationEntity[]>('/locations');
  return data;
};

export const withMapLocationProvider =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
  ({ ...props }) => {
    const { data: locations, status } = useQuery(
      'getLocations',
      () => getLocations(),
      {
        staleTime: ms('1m'),
      }
    );
    if (status === 'loading') return <Loading fullscreen />;
    if (status === 'error') return <div>Something went wrong</div>;

    return (
      <MapLocationProvider locations={locations}>
        <Component {...(props as P)} />
      </MapLocationProvider>
    );
  };
