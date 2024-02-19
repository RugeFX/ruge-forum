import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from 'app/store';

export const BASE_URL = 'https://forum-api.dicoding.dev/v1/';

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const { userToken } = (getState() as RootState).auth;
    if (userToken) {
      headers.set('Authorization', `Bearer ${userToken}`);
    }
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 5 });

export const api = createApi({
  reducerPath: 'splitApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Users', 'Threads'],
  endpoints: () => ({}),
});
