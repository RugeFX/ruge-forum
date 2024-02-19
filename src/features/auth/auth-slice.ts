import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { User } from 'types/user';
import { startAppListening } from 'app/listener-middleware';
// eslint-disable-next-line import/no-cycle
import authApi from './auth-api';

export interface AuthSliceState {
  userInfo: User | null;
  userToken: string | null;
}

const initialState: AuthSliceState = {
  userInfo: null,
  userToken: localStorage.getItem('user-token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.userToken = null;
    },
    setUserInfo: (state, action: PayloadAction<User | null>) => {
      state.userInfo = action.payload;
    },
    setUserToken: (state, action: PayloadAction<string | null>) => {
      state.userToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (_, action) => {
        // TODO: loading bar
        console.log('pending', action);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (_, action) => {
        // TODO: end loading bar
        console.log('rejected', action);
      })
      .addMatcher(
        authApi.endpoints.fetchUserInfo.matchRejected,
        () => initialState,
      )
      .addMatcher(authApi.endpoints.fetchUserInfo.matchPending, (_, action) => {
        console.log('pending', action);
      });
  },
  selectors: {
    selectToken: (state) => state.userToken,
    selectUserInfo: (state) => state.userInfo,
  },
});

export const { setUserInfo, setUserToken, logout } = authSlice.actions;

startAppListening({
  matcher: isAnyOf(setUserToken, logout),
  effect: (_, { getState }) => {
    const { userToken } = getState().auth;

    if (!userToken) {
      localStorage.removeItem('user-token');
      return;
    }

    localStorage.setItem('user-token', userToken);
  },
});

export const { selectToken, selectUserInfo } = authSlice.selectors;
export default authSlice;
