// import { LocationEntity } from '@desk-booking/data';
// import React, { useState } from 'react';

// interface UserLocationContext {
//   // location: LocationEntity;
//   // setLocation: (location: Location) => void;
//   // locations: LocationEntity[];
//   // findLocation: (name: string) => Location;
//   currentLocation: LocationEntity;
//   changeCurrentLocation: (locationId: string) => void;
//   locations: LocationEntity[];
//   findLocation: (locationId: string) => LocationEntity;
// }

// const UserLocationContext = React.createContext<UserLocationContext>(null);

// interface UserLocationProviderProps {
//   children: React.ReactNode;
//   currentLocationId: string;
//   locations: LocationEntity[];
// }

// export const UserLocationProvider = ({
//   children,
//   currentLocationId,
//   locations,
// }: UserLocationProviderProps) => {
//   const findLocation = (locationId: string) => {
//     return locations.find((location) => location.locationId === locationId);
//   };

//   const [location, setLocation] = useState(findLocation(currentLocationId));

//   const changeCurrentLocation = (locationId: string) => {
//     setLocation(findLocation(locationId));
//   };

//   return (
//     <UserLocationContext.Provider
//       value={{
//         currentLocation: location,
//         locations,
//         findLocation,
//         changeCurrentLocation,
//       }}
//     >
//       {children}
//     </UserLocationContext.Provider>
//   );
// };

// export const useUserLocation = () => React.useContext(UserLocationContext);
