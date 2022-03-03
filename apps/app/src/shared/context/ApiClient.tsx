import { RefreshTokenReturn } from '@desk-booking/data';
import axios, { AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React from 'react';
import { TokenStorage } from '../utils/TokenStorage';

// https://stackoverflow.com/questions/43002444/make-axios-send-cookies-in-its-requests-automatically

// axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const getAccessToken = (): string | null => {
  return TokenStorage.get();
};

const saveAccessToken = (token: string | null) => {
  return TokenStorage.set(token);
};

// Handle auth request header
client.interceptors.request.use((request) => {
  request.headers['Authorization'] = `Bearer ${getAccessToken()}`;
  return request;
});

// Handle refresh
createAuthRefreshInterceptor(client, (failedRequest: any) =>
  axios
    .post<RefreshTokenReturn>(`/api/auth/refresh`)
    .then((tokenRefreshResponse) => {
      saveAccessToken(tokenRefreshResponse.data.access_token);
      failedRequest.response.config.headers[
        'Authorization'
      ] = `Bearer ${tokenRefreshResponse.data.access_token}`;
      return Promise.resolve();
    })
);

/**
 * https://stackoverflow.com/a/66238542
 */

client.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);
  return originalResponse;
});

function isIsoDateString(value: string): boolean {
  const isoDateFormat =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object')
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(value);
    else if (typeof value === 'object') handleDates(value);
  }
}

interface ApiClientContext {
  client: AxiosInstance;
  getAccessToken: () => string | null;
  saveAccessToken: (token: string | null) => void;
}

interface ApiClientProvider {
  children: React.ReactChild;
}

const initialValue = {
  client,
  getAccessToken,
  saveAccessToken,
};

const ApiClientContext = React.createContext<ApiClientContext>(initialValue);

// hook
export const useApi = () => React.useContext(ApiClientContext);

export const ApiClientProvider = ({ children }: ApiClientProvider) => (
  <ApiClientContext.Provider value={initialValue}>
    {children}
  </ApiClientContext.Provider>
);
