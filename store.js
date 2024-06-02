import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './src/roomSlice/RoomSlice';

const store = configureStore({
    reducer: {
        room: roomReducer,
    }
});

export default store;