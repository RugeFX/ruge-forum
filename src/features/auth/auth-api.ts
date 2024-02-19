import { api } from 'app/api';
import type { BaseResponse } from 'types/response';
import type { User } from 'types/user';
// eslint-disable-next-line import/no-cycle
import { setUserToken } from './auth-slice';

type LoginResponse = BaseResponse<{ token: string }>;
type UserResponse = BaseResponse<{ user: User }>;
type UsersResponse = BaseResponse<{ users: User[] }>;

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
        maxRetries: 0,
      },
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled;
        dispatch(setUserToken(data.data.token));
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    fetchUserInfo: builder.query<UserResponse, void>({
      query: () => 'users/me',
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          dispatch(setUserToken(null));
        }
      },
      providesTags: (response) => [{ type: 'Users', id: response?.data.user.id }],
      extraOptions: {
        retryCondition: ({ status }) => ![400, 401, 403].includes(status as number),
      },
    }),
    fetchUsers: builder.query<UsersResponse, void>({
      query: () => 'users',
      providesTags: (result) => [
        ...(result?.data.users ?? []).map(({ id }) => ({ type: 'Users', id }) as const),
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useLoginMutation, useRegisterMutation, useFetchUserInfoQuery, useFetchUsersQuery,
} = authApi;

export default authApi;
