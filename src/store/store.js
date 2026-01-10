import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadReducer from './slices/leadSlice';
import contactReducer from './slices/contactSlice';
import uiReducer from './slices/uiSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    contacts: contactReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});