/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('requestData');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('requestData', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const initialState = {
  requestData: loadState() || {},
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    addRequest: (state, action) => {
      const today = new Date().toISOString().split('T')[0];
      if (!state.requestData[today]) {
        state.requestData[today] = { count: 0 };
      }
      state.requestData[today].count += 1;
      saveState(state.requestData);
    },
    resetRequests: (state) => {
      const today = new Date().toISOString().split('T')[0];
      state.requestData[today] = { count: 0 };
      saveState(state.requestData);
    },
  },
});

export const { addRequest, resetRequests } = requestSlice.actions;

export default requestSlice.reducer;
