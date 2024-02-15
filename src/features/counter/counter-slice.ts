/* eslint-disable no-param-reassign */
// RTK implemented Immer under the hood, so its fine to mutate the state parameter directly.
import type { PayloadAction } from '@reduxjs/toolkit';
import createAppSlice from 'app/create-app-slice';
import fetchCount from './counter-api';

export interface CounterSliceState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterSliceState = {
  value: 0,
  status: 'idle',
};

const counterSlice = createAppSlice({
  name: 'counter',
  initialState,
  reducers: (create) => ({
    increment: create.reducer((state) => {
      state.value += 1;
    }),
    decrement: create.reducer((state) => {
      state.value -= 1;
    }),
    incrementByAmount: create.reducer((state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }),
    incrementAsync: create.asyncThunk(
      async (amount: number) => {
        const response = await fetchCount(amount);
        return response.data;
      },
      {
        pending: (state) => {
          state.status = 'loading';
        },
        fulfilled: (state, action) => {
          state.status = 'idle';
          state.value += action.payload;
        },
        rejected: (state) => {
          state.status = 'failed';
        },
      },
    ),
  }),
  selectors: {
    selectCount: (counter) => counter.value,
    selectStatus: (counter) => counter.status,
  },
});

export const {
  decrement, increment, incrementByAmount, incrementAsync,
} = counterSlice.actions;
export const { selectCount, selectStatus } = counterSlice.selectors;

export default counterSlice;
