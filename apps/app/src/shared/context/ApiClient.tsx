import {
  FindAllLocationReturn,
  FindOneAreaWithBookingResponse,
  RefreshTokenReturn,
} from '@desk-booking/data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { TokenStorage } from '../utils/TokenStorage';
import validator from 'validator';

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
createAuthRefreshInterceptor(client, (failedRequest) =>
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
  make: {
    area: {
      findOne: (findOneParams: {
        id: string;
        from: Dayjs;
        to: Dayjs;
      }) => Promise<AxiosResponse<FindOneAreaWithBookingResponse, any>>;
    };
    location: {
      findAll: () => Promise<AxiosResponse<FindAllLocationReturn, any>>;
    };
  };
}

interface ApiClientProvider {
  children: React.ReactChild;
}

const initialValue: ApiClientContext = {
  client,
  getAccessToken,
  saveAccessToken,
  make: {
    area: {
      findOne: ({ id, from, to }) => {
        return client.get<FindOneAreaWithBookingResponse>(
          `/areas/${id}/bookings`,
          {
            params: {
              from: from.toDate(),
              to: to.toDate(),
            },
          }
        );
      },
    },
    location: {
      findAll: async () => {
        return await client.get<FindAllLocationReturn>('/locations');
      },
    },
  },
};

const ApiClientContext = React.createContext<ApiClientContext>(initialValue);

// hook
export const useApi = () => React.useContext(ApiClientContext);

export const ApiClientProvider = ({ children }: ApiClientProvider) => (
  <ApiClientContext.Provider value={initialValue}>
    {children}
  </ApiClientContext.Provider>
);
