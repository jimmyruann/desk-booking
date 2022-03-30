import { LocationEntity } from '@desk-booking/data';
import { useUncontrolled } from '@mantine/hooks';
import React from 'react';

interface MapLocationContext {
  currentLocation: LocationEntity;
  changeCurrentLocation: (locationId: string) => void;
  locations: LocationEntity[];
  findLocation: (locationId: string) => LocationEntity;
}

const MapLocationContext = React.createContext<MapLocationContext>(null);

interface MapLocationProviderProps {
  children: React.ReactNode;
  initialLocationId: string;
  locations: LocationEntity[];
  useLocationHook?: () => [LocationEntity, (location: LocationEntity) => void];
}

export const MapLocationProvider = ({
  children,
  initialLocationId,
  locations,
}: MapLocationProviderProps) => {
  const findLocation = (locationId: string) => {
    return locations.find((location) => location.locationId === locationId);
  };

  // let [location, setLocation] = useState<LocationEntity>(
  //   findLocation(initialLocationId)
  // );

  const [_locationId, handleLocationIdChange] = useUncontrolled<string>({});

  const changeCurrentLocation = (locationId: string) => {
    setLocation(findLocation(locationId));
  };

  return (
    <MapLocationContext.Provider
      value={{
        currentLocation: location,
        locations,
        findLocation,
        changeCurrentLocation,
      }}
    >
      {children}
    </MapLocationContext.Provider>
  );
};

export const useMapLocation = () => React.useContext(MapLocationContext);
