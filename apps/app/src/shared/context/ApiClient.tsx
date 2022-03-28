import { AxiosInstance } from 'axios';
import React from 'react';
import {
  axiosApiClient,
  getAccessToken,
  getAccessTokenFn,
  saveAccessToken,
  saveAccessTokenFn,
} from '../api/api';

interface ApiClientContext {
  client: AxiosInstance;
  getAccessToken: getAccessTokenFn;
  saveAccessToken: saveAccessTokenFn;
}

const ApiClientContext = React.createContext<ApiClientContext>(null);

export const useApi = () => React.useContext(ApiClientContext);

export const ApiClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ApiClientContext.Provider
    value={{
      client: axiosApiClient,
      getAccessToken,
      saveAccessToken,
    }}
  >
    {children}
  </ApiClientContext.Provider>
);
