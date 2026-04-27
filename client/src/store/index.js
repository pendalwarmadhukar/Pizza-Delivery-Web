import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import builderReducer from './slices/builderSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    builder: builderReducer,
    orders: orderReducer,
  },
});
