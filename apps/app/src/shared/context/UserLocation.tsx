import React, { useState } from 'react';

interface UserLocationContext {
  location: string;
  setLocation: (location: string) => void;
}

const UserLocationContext = React.createContext<UserLocationContext>({
  location: '',
  setLocation: (location: string) => null,
});

export const UserLocationProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [location, setLocation] = useState(
    localStorage.getItem('location') || 'singapore'
  );

  const setLocationModified = (location: string) => {
    localStorage.setItem('location', location);
    setLocation(location);
  };

  return (
    <UserLocationContext.Provider
      value={{
        location,
        setLocation: setLocationModified,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = () => React.useContext(UserLocationContext);
