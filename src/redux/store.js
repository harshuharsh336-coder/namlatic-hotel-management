import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './hotelSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    hotels: hotelReducer,
    bookings: bookingReducer,
  },
});

