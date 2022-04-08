import axios from 'axios';
import dayjs from 'dayjs';
import validator from 'validator';

export const axiosApiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 2000,
});

// Serialize Date
axiosApiClient.interceptors.response.use((originalResponse) => {
  originalResponse.data = JSON.parse(
    JSON.stringify(originalResponse.data),
    (key: string, value: unknown) => {
      // https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
      if (typeof value === 'string' && validator.isISO8601(value)) {
        return dayjs(value).utc(false).toDate();
      }
      return value;
    }
  );

  return originalResponse;
});
