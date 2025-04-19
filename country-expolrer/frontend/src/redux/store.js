// client/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from './slices/countriesSlice';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
});