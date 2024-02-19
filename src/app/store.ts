import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authApi from 'features/auth/auth-api';
import authSlice from 'features/auth/auth-slice';
import threadApi from 'features/thread/thread-api';
import { listenerMiddleware } from './listener-middleware';

const rootReducer = combineSlices(authSlice, authApi, threadApi);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
      authApi.middleware,
      threadApi.middleware,
      listenerMiddleware.middleware,
    ),
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
ThunkReturnType,
RootState,
unknown,
Action
>;
