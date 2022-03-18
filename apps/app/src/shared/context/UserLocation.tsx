import { FindAllLocationReturn } from '@desk-booking/data';
import { Location } from '@prisma/client';
import _ from 'lodash';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useApi } from './ApiClient';

interface UserLocationContext {
  location: Location;
  setLocation: (location: Location) => void;
  locations: FindAllLocationReturn;
  findLocation: (name: string) => Location;
}

const UserLocationContext = React.createContext<UserLocationContext>({
  location: null,
  setLocation: (location: Location) => null,
  locations: [],
  findLocation: (name: string) => null,
});

export const UserLocationProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const initialLocation = localStorage.getItem('location_name') || 'singapore';

  const api = useApi();
  const [location, setLocation] = useState<Location>(null);

  const { data: locations, status } = useQuery(
    'GET_ALL_LOCATIONS',
    async () => {
      const { data } = await api.make.location.findAll();
      return data;
    },
    {
      onSuccess: (data) => {
        setLocation(
          _.find(data, {
            locationId: location ? location.locationId : initialLocation,
          })
        );
      },
    }
  );

  const findLocation = (locationId: string) => {
    return _.find(locations, { locationId });
  };

  if (status === 'loading') return <div>Loading</div>;

  return (
    <UserLocationContext.Provider
      value={{
        location,
        setLocation: (location: Location) => {
          localStorage.setItem('location_name', location.locationId);
          setLocation(location);
        },
        locations: locations || [],
        findLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => React.useContext(UserLocationContext);
