import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import dayjs from 'dayjs';
import validator from 'validator';
import { TokenStorage } from '../utils/TokenStorage';

export type getAccessTokenFn = () => string | null;
export type saveAccessTokenFn = (token: string | null) => void;

export const getAccessToken: getAccessTokenFn = () => {
  return TokenStorage.get();
};

export const saveAccessToken: saveAccessTokenFn = (token: string | null) => {
  return TokenStorage.set(token);
};

export const axiosApiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 2000,
});

// Handle auth request header
axiosApiClient.interceptors.request.use((request) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${getAccessToken()}`;
  }
  return request;
});

// Serialize Date
axiosApiClient.interceptors.response.use((originalResponse) => {
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

// Handle refresh
createAuthRefreshInterceptor(axiosApiClient, (failedRequest) =>
  axios
    .post(`/api/auth/refresh`, null, {
      timeout: 2000,
    })
    .then((tokenRefreshResponse) => {
      saveAccessToken(tokenRefreshResponse.data.access_token);
      failedRequest.response.config.headers[
        'Authorization'
      ] = `Bearer ${tokenRefreshResponse.data.access_token}`;
      return Promise.resolve();
    })
);
