import React, { useState } from 'react';

interface GlobalMessageContext {
  message: string;
  setMessage: (message: string) => void;
}

const GlobalMessageContext = React.createContext<GlobalMessageContext>({
  message: '',
  setMessage: (message: string) => null,
});

export const useGlobalMessage = () => React.useContext(GlobalMessageContext);
export const GlobalMessageProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [message, setMessage] = useState('');

  return (
    <GlobalMessageContext.Provider value={{ message, setMessage }}>
      {children}
    </GlobalMessageContext.Provider>
  );
};
