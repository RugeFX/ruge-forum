import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { RootState } from 'app/store';
import type { BaseResponse } from 'types/response';

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

const baseQueryWithRetry = retry(baseQuery, {
  retryCondition: ({ status }) => ![400, 401, 404].includes(status as number),
});

const baseQueryWithTransform: typeof baseQueryWithRetry = async (...args) => {
  const result = await baseQueryWithRetry(...args);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((result as BaseResponse<any>).data) return result.data as any;

  return result;
};

export const api = createApi({
  reducerPath: 'splitApi',
  baseQuery: baseQueryWithTransform,
  tagTypes: ['Users', 'Threads', 'Leaderboard'],
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: () => ({}),
});
