import { api } from 'app/api';
import type { BaseResponse } from 'types/response';
import type { User } from 'types/user';
// eslint-disable-next-line import/no-cycle
import { setUserInfo, setUserToken } from './auth-slice';

type LoginResponse = BaseResponse<{ token: string }>;
type UserResponse = BaseResponse<{ user: User }>;

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
          const { data } = await queryFulfilled;
          dispatch(setUserInfo(data.data.user));
        } catch (err) {
          dispatch(setUserInfo(null));
          dispatch(setUserToken(null));
        }
      },
      providesTags: (response) => [
        { type: 'Users', id: response?.data.user.id },
      ],
      extraOptions: {
        retryCondition: ({ status }) => ![400, 401, 403].includes(status as number),
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useFetchUserInfoQuery } = authApi;
export default authApi;
