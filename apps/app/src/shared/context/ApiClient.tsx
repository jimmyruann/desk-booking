import {
  DeleteBookingResponse,
  FindAllLocationReturn,
  FindAreaAvailabilitiesResponse,
  FindOneAreaWithBookingResponse,
  RefreshTokenReturn,
  UpdateLocationDto,
  UpdateLocationResponse,
} from '@desk-booking/data';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import validator from 'validator';
import { TokenStorage } from '../utils/TokenStorage';

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
      }) => Promise<AxiosResponse<FindOneAreaWithBookingResponse>>;
      findAvailabilities: (findAvailabilitiesParams: {
        id: string;
        date: Dayjs;
      }) => Promise<AxiosResponse<FindAreaAvailabilitiesResponse>>;
    };
    location: {
      findAll: () => Promise<AxiosResponse<FindAllLocationReturn>>;
      updateLocation: (data: {
        id: number;
        data: UpdateLocationDto;
      }) => Promise<AxiosResponse<UpdateLocationResponse>>;
    };
    booking: {
      deleteBooking: (deleteParams: {
        id: number;
      }) => Promise<AxiosResponse<DeleteBookingResponse>>;
    };
  };
}

const ApiClientContext = React.createContext<ApiClientContext>(null);

// hook
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
          findAvailabilities: ({ id, date }) => {
            return client.get<FindAreaAvailabilitiesResponse>(
              `/areas/${id}/availabilities`,
              {
                params: {
                  date: date.toDate(),
                },
              }
            );
          },
        },
        location: {
          findAll: async () => {
            return await client.get<FindAllLocationReturn>('/locations');
          },
          updateLocation: async ({ id, data }) => {
            return await client.patch<UpdateLocationResponse>(
              `/locations/${id}`,
              data
            );
          },
        },
        booking: {
          deleteBooking: async ({ id }) => {
            return await client.delete<DeleteBookingResponse>(
              `/bookings/${id}`
            );
          },
        },
      },
    }}
  >
    {children}
  </ApiClientContext.Provider>
);
