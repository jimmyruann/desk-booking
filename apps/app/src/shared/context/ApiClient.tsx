import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import dayjs from 'dayjs';
import React from 'react';
import validator from 'validator';
import { TokenStorage } from '../utils/TokenStorage';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 2000,
});

// Handle auth request header
client.interceptors.request.use((request) => {
  request.headers['Authorization'] = `Bearer ${getAccessToken()}`;
  return request;
});

// Handle refresh
createAuthRefreshInterceptor(client, (failedRequest) =>
  axios
    //<RefreshTokenResponse>
    .post(`/api/auth/refresh`)
    .then((tokenRefreshResponse) => {
      saveAccessToken(tokenRefreshResponse.data.access_token);
      failedRequest.response.config.headers[
        'Authorization'
      ] = `Bearer ${tokenRefreshResponse.data.access_token}`;
      return Promise.resolve();
    })
);

// Serialize Date
client.interceptors.response.use((originalResponse) => {
  // https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
  originalResponse.data = JSON.parse(
    JSON.stringify(originalResponse.data),
    (key, value) => {
      if (typeof value === 'string' && validator.isISO8601(value)) {
        return dayjs(value).utc(false).toDate();
      }
      return value;
    }
  );

  return originalResponse;
});

interface ApiClientContext {
  client: AxiosInstance;
  getAccessToken: () => string | null;
  saveAccessToken: (token: string | null) => void;
}

const getAccessToken = (): string | null => {
  return TokenStorage.get();
};

const saveAccessToken = (token: string | null) => {
  return TokenStorage.set(token);
};

const ApiClientContext = React.createContext<ApiClientContext>(null);

export const useApi = () => React.useContext(ApiClientContext);

export const ApiClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ApiClientContext.Provider
    value={{
      client,
      getAccessToken,
      saveAccessToken,
    }}
  >
    {children}
  </ApiClientContext.Provider>
);
