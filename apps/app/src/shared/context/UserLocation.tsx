import { LocationEntity } from '@desk-booking/data';
import React, { useState } from 'react';

interface UserLocationContext {
  // location: LocationEntity;
  // setLocation: (location: Location) => void;
  // locations: LocationEntity[];
  // findLocation: (name: string) => Location;
  currentLocation: LocationEntity;
  changeCurrentLocation: (locationId: string) => void;
  locations: LocationEntity[];
  findLocation: (locationId: string) => LocationEntity;
}

const UserLocationContext = React.createContext<UserLocationContext>(null);

// export const UserLocationProvider = ({
//   children,
// }: {
//   children: React.ReactChild;
// }) => {
//   const initialLocation =
//     localStorage.getItem('location_name') || 'sydney_lv18';

//   const api = useApi();
//   const [location, setLocation] = useState<Location>(null);

//   const { data: locations, status } = useQuery(
//     'GET_ALL_LOCATIONS',
//     async () => {
//       const { data } = await api.client.get<LocationEntity[]>('/locations');
//       return data;
//     },
//     {
//       onSuccess: (data) => {
//         setLocation(
//           _.find(data, {
//             locationId: location ? location.locationId : initialLocation,
//           })
//         );
//       },
//     }
//   );

//   console.log(location, locations);

//   const findLocation = (locationId: string) => {
//     return _.find(locations, { locationId });
//   };

//   if (status === 'loading') return <div>Loading</div>;
//   if (status === 'error') return <ServerError />;

//   return (
//     <UserLocationContext.Provider
//       value={{
//         location,
//         setLocation: (location: Location) => {
//           localStorage.setItem('location_name', location.locationId);
//           setLocation(location);
//         },
//         locations,
//         findLocation,
//       }}
//     >
//       {children}
//     </UserLocationContext.Provider>
//   );
// };

interface UserLocationProviderProps {
  children: React.ReactNode;
  currentLocationId: string;
  locations: LocationEntity[];
}

export const UserLocationProvider = ({
  children,
  currentLocationId,
  locations,
}: UserLocationProviderProps) => {
  const findLocation = (locationId: string) => {
    return locations.find((location) => location.locationId === locationId);
  };

  const [location, setLocation] = useState(findLocation(currentLocationId));

  const changeCurrentLocation = (locationId: string) => {
    setLocation(findLocation(locationId));
  };

  return (
    <UserLocationContext.Provider
      value={{
        currentLocation: location,
        locations,
        findLocation,
        changeCurrentLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => React.useContext(UserLocationContext);
