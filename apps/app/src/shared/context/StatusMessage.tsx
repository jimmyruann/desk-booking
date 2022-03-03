import React, { useState } from 'react';

interface StatusMesasge {
  message: {
    message: string;
    isError: boolean;
  };
  setMessage: ({
    message,
    isError,
  }: {
    message: string;
    isError: boolean;
  }) => void;
}

const StatusMessageContext = React.createContext<StatusMesasge>({
  message: {
    message: '',
    isError: false,
  },
  setMessage: ({ message, isError }: { message: string; isError: boolean }) =>
    null,
});

export const useStatusMessage = () => React.useContext(StatusMessageContext);
export const StatusMessageProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [message, setMessage] = useState({
    message: '',
    isError: false,
  });

  return (
    <StatusMessageContext.Provider
      value={{
        message,
        setMessage,
      }}
    >
      {children}
    </StatusMessageContext.Provider>
  );
};

export const withStatusMessage =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
  ({ ...props }) => {
    return (
      <StatusMessageProvider>
        <Component {...(props as P)} />
      </StatusMessageProvider>
    );
  };
