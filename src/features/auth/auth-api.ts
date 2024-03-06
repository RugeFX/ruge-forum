import { api } from 'app/api';
import type { User } from 'types/user';
// eslint-disable-next-line import/no-cycle
import { setUserToken } from './auth-slice';

type LoginResponse = { token: string };
type UserResponse = { user: User };
type UsersResponse = { users: User[] };

type LoginPayload = { email: string; password: string };
type RegisterPayload = LoginPayload & { name: string };

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      extraOptions: {
        retryCondition: ({ status }) => ![400, 401, 403].includes(status as number),
      },
      onQueryStarted: (_, { queryFulfilled, dispatch }) => {
        queryFulfilled.then(({ data }) => dispatch(setUserToken(data.token))).catch(() => {});
      },
    }),
    register: builder.mutation<UserResponse, RegisterPayload>({
      query: (body) => ({
        url: 'register',
        method: 'POST',
        body,
      }),
      extraOptions: {
        maxRetries: 0,
      },
      invalidatesTags: [{ type: 'Users' }],
    }),
    fetchUserInfo: builder.query<UserResponse, void>({
      query: () => 'users/me',
      onQueryStarted: (_, { queryFulfilled, dispatch }) => {
        queryFulfilled.catch(() => dispatch(setUserToken(null)));
      },
      providesTags: (response) => [{ type: 'Users', id: response?.user.id }],
      extraOptions: {
        retryCondition: ({ status }) => ![400, 401, 403].includes(status as number),
      },
    }),
    fetchUsers: builder.query<UsersResponse, void>({
      query: () => 'users',
      providesTags: (result) => [
        ...(result?.users ?? []).map(({ id }) => ({ type: 'Users', id }) as const),
        { type: 'Users' },
      ],
    }),
  }),
});

export const {
  useLoginMutation, useRegisterMutation, useFetchUserInfoQuery, useFetchUsersQuery,
} = authApi;

export default authApi;
