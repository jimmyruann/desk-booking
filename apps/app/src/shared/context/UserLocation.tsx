import { FindAllLocationReturn } from '@desk-booking/data';
import { Location } from '@prisma/client';
import _ from 'lodash';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useApi } from './ApiClient';

interface UserLocationContext {
  location: string;
  setLocation: (location: string) => void;
  readonly locations: FindAllLocationReturn;
  getLocation: (name: string) => Location;
}

const UserLocationContext = React.createContext<UserLocationContext>({
  location: '',
  setLocation: (location: string) => null,
  locations: [],
  getLocation: (name: string) => null,
});

export const UserLocationProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const api = useApi();
  const [location, setLocation] = useState(
    localStorage.getItem('location') || 'singapore'
  );

  const setLocationModified = (location: string) => {
    localStorage.setItem('location', location);
    setLocation(location);
  };

  const getLocation = (name: string): Location => {
    return _.find(locations, { name });
  };

  const { data: locations, isLoading: locationsIsLoading } = useQuery(
    'GET_ALL_LOCATIONS',
    async () => {
      const { data } = await api.client.get<FindAllLocationReturn>(
        '/locations'
      );
      return data;
    }
  );

  if (locationsIsLoading) return <div>Loading</div>;

  return (
    <UserLocationContext.Provider
      value={{
        location,
        setLocation: setLocationModified,
        locations,
        getLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => React.useContext(UserLocationContext);
