import { addRoomData } from './RoomApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const addRoomDataAsync = createAsyncThunk(
    'room/addRoomData',
    async(data) =>{
        const response = await addRoomData(data)
        return response.data;
    }
  );

const initialState = {
    roomTextEditor: null,
    roomWhiteBoard: null,
    roomCodeEditor: null,
    loading: false,
    error: null
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoomTextEditor: (state, action) => {
            state.roomTextEditor = action.payload;
        },
        setRoomWhiteBoard: (state, action) => {
            state.roomWhiteBoard = action.payload;
            console.log(state.roomWhiteBoard)
        },
        setRoomCodeEditor: (state, action) => {
            state.roomCodeEditor = action.payload;
            console.log(state.roomCodeEditor)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addRoomDataAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRoomDataAsync.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addRoomDataAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});


export const { setRoomTextEditor, setRoomWhiteBoard, setRoomCodeEditor } = roomSlice.actions;

export const selectRoomTextEditor = (state) => state.room.roomTextEditor;
export const selectRoomWhiteBoard = (state) => state.room.roomWhiteBoard;

export { addRoomDataAsync }; 

export default roomSlice.reducer;