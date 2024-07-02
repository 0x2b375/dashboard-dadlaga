import { configureStore } from '@reduxjs/toolkit';
import requestReducer from './requestSlice';

const store = configureStore({
  reducer: {
    requests: requestReducer,
  },
});

export default store;
