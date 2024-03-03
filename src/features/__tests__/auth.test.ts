import { act, waitFor } from '@testing-library/react';
import {
  useFetchUserInfoQuery,
  useFetchUsersQuery,
  useLoginMutation,
  useRegisterMutation,
} from 'features/auth/auth-api';
import authSlice, { logout, selectToken, setUserToken } from 'features/auth/auth-slice';
import { renderHookWithProviders } from 'utils/test-utils';
import { describe, expect, it } from 'vitest';

describe('Auth Reducer', () => {
  const { reducer } = authSlice;

  it('should return the initial state', async () => {
    const initialState = {
      userToken: null,
    };

    const result = reducer(undefined, { type: 'unknown' });

    expect(result).toEqual(initialState);
  });

  it('should set userToken correctly when setUserToken is dispatched', () => {
    const userToken = 'user-test-token';

    const result = reducer(undefined, setUserToken(userToken));

    expect(result).toEqual({ userToken });
  });

  it('should set state correctly when logout is dispatched', () => {
    const initialState = { userToken: 'token-test' };

    const result = reducer(initialState, logout());

    expect(result).toEqual({ userToken: null });
  });
});

describe('Auth API', () => {
  it('should return token and set state correctly after login mutation is fulfilled', async () => {
    const credentials = {
      email: 'test@email.com',
      password: 'test123',
    };
    const resultToken = 'user-test-token';

    const { result, store } = renderHookWithProviders(() => useLoginMutation());
    const [login] = result.current;

    act(() => {
      login(credentials);
    });

    await waitFor(() => expect(result.current[1].isSuccess).toBe(true));
    const response = result.current[1];

    expect(response).toMatchObject({
      endpointName: 'login',
      status: 'fulfilled',
    });
    expect(response.data).toBeDefined();

    expect(response.data!.token).toBe(resultToken);
    expect(selectToken(store.getState())).toBe(resultToken);
    expect(localStorage.getItem('user-token')).toBe(resultToken);
  });

  it('should return user after register mutation is fulfilled', async () => {
    const credentials = {
      name: 'Test User',
      email: 'test@email.com',
      password: 'test123',
    };

    const { result } = renderHookWithProviders(() => useRegisterMutation());
    const [register] = result.current;

    act(() => {
      register(credentials);
    });

    await waitFor(() => expect(result.current[1].isSuccess).toBe(true));
    const response = result.current[1];

    expect(response).toMatchObject({
      endpointName: 'register',
      status: 'fulfilled',
    });
    expect(response.data).toBeDefined();

    expect(response.data!.user.email).toBe(credentials.email);
    expect(response.data!.user.name).toBe(credentials.name);
  });

  it('should return userInfo after fetchUserInfo query is fulfilled', async () => {
    const userToken = 'user-test-token';
    const userId = 'user-test-one';

    const { result } = renderHookWithProviders(() => useFetchUserInfoQuery(), {
      preloadedState: { auth: { userToken } },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject({
      endpointName: 'fetchUserInfo',
      status: 'fulfilled',
    });
    expect(result.current.data).toBeDefined();

    expect(result.current.data!.user.id).toBe(userId);
  });

  it('should set state correctly after fetchUserInfo query using an invalid token is rejected with the status code 401', async () => {
    const { result, store } = renderHookWithProviders(() => useFetchUserInfoQuery(), {
      preloadedState: { auth: { userToken: 'invalid-test-token' } },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current).toMatchObject({
      endpointName: 'fetchUserInfo',
      status: 'rejected',
    });

    expect(selectToken(store.getState())).toBeNull();
  });

  it('should return a list of users after fetchUsers query is fulfilled', async () => {
    const userId = 'user-test-one';

    const { result } = renderHookWithProviders(() => useFetchUsersQuery());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current).toMatchObject({
      endpointName: 'fetchUsers',
      status: 'fulfilled',
    });
    expect(result.current.data).toBeDefined();

    const { users } = result.current.data!;

    expect(users).toHaveLength(2);
    expect(users[0].id).toBe(userId);
  });
});
